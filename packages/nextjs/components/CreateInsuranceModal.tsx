import React, { useState } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface CreateInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateInsuranceModal: React.FC<CreateInsuranceModalProps> = ({ isOpen, onClose }) => {
  const { writeContractAsync } = useScaffoldWriteContract("InFlameInsurancePolicyNFT");
  const { address: connectedAddress } = useAccount();

  const [formData, setFormData] = useState({
    ownerName: "",
    houseAddress: "",
    houseValue: "",
    proofOfOwnership: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  // Watch for PolicyIssued event
  useScaffoldWatchContractEvent({
    contractName: "InFlameInsurancePolicyNFT",
    eventName: "PolicyIssued",
    onLogs: logs => {
      logs.forEach(log => {
        const { owner, tokenId, expiration } = log.args;
        if (owner === connectedAddress && loading) {
          console.log("📡 PolicyIssued event", tokenId, owner, expiration);
          toast.success("Policy issued successfully!");
          setLoading(false); // Disable loading when event is received
          onClose(); // Close modal on successful issuance
        }
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === "houseValue" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        //@ts-ignore
        proofOfOwnership: e.target.files[0],
      }));
    }
  };

  const issuePolicy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { houseAddress, houseValue, proofOfOwnership } = formData;

    if (houseAddress && Number(houseValue) > 0 && proofOfOwnership) {
      setLoading(true); // Set loading to true on submit
      try {
        await writeContractAsync({
          functionName: "issuePolicy",
          args: [connectedAddress, parseEther(houseValue.toString()), houseAddress],
          value: parseEther(((Number(houseValue) * 83) / 1000 + 0.0001).toString()),
        });

        // Reset form after submission
        setFormData({ ownerName: "", houseAddress: "", houseValue: "", proofOfOwnership: null });
      } catch (error) {
        console.error("Error issuing policy:", error);
        setLoading(false); // Reset loading if error occurs
      }
    } else {
      console.error("All fields are mandatory.");
    }
  };
  const monthlyCost = formData.houseValue ? (Number(formData.houseValue) * 0.00083).toFixed(4) : "0.0000";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Create Insurance Policy</h2>
        <form onSubmit={issuePolicy}>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">House Value</span>
            </label>

            <EtherInput
              value={formData.houseValue}
              onChange={amount =>
                setFormData(prevState => ({
                  ...prevState,
                  houseValue: amount,
                }))
              }
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">House Address</span>
            </label>
            <input
              type="text"
              name="houseAddress"
              required
              value={formData.houseAddress}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Client Name</span>
            </label>
            <input
              type="text"
              name="ownerName"
              required
              value={formData.ownerName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Proof of Ownership (PDF)</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>
          <button type="submit" className={`btn btn-accent w-full ${loading ? "btn-loading" : ""}`} disabled={loading}>
            {loading ? "Submitting..." : `Submit - ${monthlyCost} ETH / month`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInsuranceModal;
