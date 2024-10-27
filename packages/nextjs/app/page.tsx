"use client";

import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CreateInsuranceModal from "~~/components/CreateInsuranceModal";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          {/* Updated Image Component */}
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

        <CreateInsuranceModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default Home;
