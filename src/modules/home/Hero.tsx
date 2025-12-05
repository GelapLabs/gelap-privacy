"use client";

import { ArrowUpRight } from "lucide-react";
import { CardScanner } from "@/src/components/Layout/CardScanner";
import { useTransfer } from "@/src/contexts/TransferContext";

export default function Hero() {
  const { isExpanded, openTransfer } = useTransfer();

  const handleExpand = () => {
    openTransfer();
  };

  return (
    <div className="flex text-center justify-center items-center flex-col bg-gradient-to-b to-primary from-primary-800 min-h-screen">
      <CardScanner />
      <div className="flex justify-center flex-col mt-4 items-center gap-4">
        <h1 className="bg-linear-to-br from-white to-[#EFF4FF] bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-6xl">
          The{" "}
          <span className="inline-block bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 bg-clip-text text-primary-300 transition-all duration-700 ease-in-out  cursor-pointer">
            Easiest
          </span>{" "}
          Hidden Layer <br />
          Web3 Transfer Experience
        </h1>
        <p className="text-lg text-white sm:text-xl mb-2">
          Fast, private, and invisible blockchain transfers—powered by next-gen
          encryption.
        </p>
        {!isExpanded && (
          <div className="inline-block relative">
            <button
              onClick={handleExpand}
              className="h-15 px-6 sm:px-8 rounded-full bg-radial from-primary-600 to-primary-800 hover:from-primary-200 hover:to-primary-100 hover:text-primary-800 hover:shadow-lg font-semibold hover:shadow-white cursor-pointer transition-all duration-500 py-3 text-lg sm:text-xl font-regular text-[#E3E3E3] hover:text-[#FFFFFF] tracking-[-0.01em] relative"
            >
              Transfer Now <ArrowUpRight className="inline-block" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
