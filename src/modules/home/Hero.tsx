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
    <div className="bg-linear-to-b flex text-center justify-center items-center flex-col bg-[linear-gradient(to_bottom,rgba(0,79,229,0.1)_0%,#004FE5_50%,rgba(255,255,255,0.9)_100%)] min-h-screen">
      <CardScanner />
      <div className="flex justify-center flex-col mt-4 items-center gap-4">
        <h1 className="bg-linear-to-br from-white to-[#EFF4FF] bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-6xl">
          The <span className="text-[#fa6c01]">Easiest</span> Hidden Layer{" "}
          <br />
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
              className="h-15 px-6 sm:px-8 rounded-full bg-[#fa6c01] hover:bg-[#fa6c01]/90 hover:shadow-lg font-semibold hover:shadow-white cursor-pointer transition-all duration-300 py-3 text-lg sm:text-xl font-regular text-[#E3E3E3] tracking-[-0.01em] relative"
            >
              Transfer Now <ArrowUpRight className="inline-block" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
