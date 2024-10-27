"use client";

import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CreateInsuranceModal from "~~/components/CreateInsuranceModal";
import PolicyCard from "~~/components/PolicyCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const { data: tokenIds } = useScaffoldReadContract({
    contractName: "InFlameInsurancePolicyNFT",
    functionName: "tokensOfOwner",
    args: [connectedAddress],
    watch: true,
  });
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center h-screen flex-col">
        <div className="text-center">
          <div className="relative h-48 w-48 mx-auto mb-4">
            <Image alt="InFlame Insurance Logo" className="object-contain" layout="fill" src="/logo.svg" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Welcome to InFlame Insurance</h1>
          <p className="mb-6">Secure your house with our insurance policies.</p>
          <button
            onClick={openModal}
            className="bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/70 transition-all "
          >
            Create Insurance
          </button>
        </div>
        {tokenIds && connectedAddress && tokenIds.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-center">Your active subscriptions</h2>

            <div className="flex flex-col justify-center gap-5">
              {tokenIds.map((tokenId, i) => (
                <div className="w-full" key={i}>
                  <PolicyCard tokenId={tokenId.toString()} />
                </div>
              ))}
            </div>
          </div>
        )}
        <CreateInsuranceModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default Home;
