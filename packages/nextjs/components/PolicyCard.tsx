"use client";

import React, { useState } from "react";
import { ClaimInsuranceModal } from "./ClaimInsuranceModal";
import { formatEther } from "viem";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const PolicyCard = ({ tokenId }: { tokenId: string }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const { data: details } = useScaffoldReadContract({
    contractName: "InFlameInsurancePolicyNFT",
    functionName: "policies",
    args: [BigInt(tokenId)],
    watch: true,
  });
  if (details?.length)
    return (
      <div className="card bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title text-md">
            <HomeIcon className="h-6 w-6" />
            {details[1]}
          </h2>
          <p>
            {/*@ts-ignore*/}
            Expires at {new Date(details[4]!.toString() * 1000).toLocaleDateString("en-GB")}
          </p>

          <p className="text-emerald-700 font-semibold">
            {/*@ts-ignore*/}
            {parseFloat(formatEther(details[2]!.toString())).toFixed(4)} ETH / month
          </p>
          <div className="card-actions justify-end">
            <button onClick={openModal} className="btn btn-accent">
              Make a claim
            </button>
          </div>
        </div>
        <ClaimInsuranceModal isOpen={isModalOpen} onClose={closeModal} tokenId={tokenId} />
      </div>
    );
  return <span className="loading loading-spinner loading-lg"></span>;
};

export default PolicyCard;
