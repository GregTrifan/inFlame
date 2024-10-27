import React, { useState } from "react";
import toast from "react-hot-toast";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface ClaimInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: string;
}

export const ClaimInsuranceModal = ({ isOpen, onClose, tokenId }: ClaimInsuranceModalProps) => {
  const { writeContractAsync } = useScaffoldWriteContract("InFlameInsurancePolicyNFT");
  const { address: connectedAddress } = useAccount();

  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  // Watch for PayoutProcessed event
  useScaffoldWatchContractEvent({
    contractName: "InFlameInsurancePolicyNFT",
    eventName: "PayoutProcessed",
    onLogs: logs => {
      logs.forEach(log => {
        const { tokenId, claimant, amount } = log.args;
        if (claimant === connectedAddress && loading) {
          console.log("📡 PayoutProcessed event", tokenId, claimant, amount);
          toast.success(
            //@ts-ignore
            `Claim fulfilled successfully! - Received ${parseFloat(formatEther(amount!.toString())).toFixed(4)} ETH`,
          );
          setLoading(false); // Disable loading when event is received
          onClose(); // Close modal on successful issuance
        }
      });
    },
  });

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofFiles(Array.from(e.target.files));
    }
  };

  const handleClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!explanation || proofFiles.length === 0) {
      toast.error("Please provide an explanation and at least one proof file.");
      return;
    }

    setLoading(true);
    try {
      // Assuming a method to handle the proof submission
      await writeContractAsync({
        functionName: "claimInsurance",
        args: [BigInt(tokenId)], // Just send back 1mo worth of $$
      });
    } catch (error) {
      console.error("Error processing claim:", error);
      setLoading(false); // Reset loading if error occurs
    }
  };

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
        <h2 className="text-xl font-bold mb-4">Claim Insurance</h2>
        <form onSubmit={handleClaim}>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Explanation</span>
            </label>
            <textarea
              required
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Proof of Claim (Images)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleProofChange}
              className="file-input file-input-bordered w-full"
            />
          </div>
          <button type="submit" className={`btn btn-accent w-full ${loading ? "btn-loading" : ""}`} disabled={loading}>
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};
