"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export interface TreasuryRates {
  ustbYield: number;
  usdcLend: number;
  privateCredit: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

interface DeFiLlamaPool {
  pool: string;
  project: string;
  symbol: string;
  chain: string;
  apy: number;
  tvlUsd: number;
}

// ============================================================================
// Constants
// ============================================================================

const DEFI_LLAMA_YIELDS_URL = "https://yields.llama.fi/pools";

// Pool IDs or search patterns for specific yields
const YIELD_SOURCES = {
  // USDC lending rates on major protocols
  usdcLend: ["aave-v3", "compound-v3"],
  // T-Bill / Treasury yield proxies
  ustb: ["backed-finance", "ondo-finance", "mountain-protocol"],
  // Private credit protocols
  privateCredit: ["maple-finance", "goldfinch", "centrifuge"],
};

// ============================================================================
// Hook
// ============================================================================

export function useTreasuryRates(): TreasuryRates & { refresh: () => Promise<void> } {
  const [rates, setRates] = useState<TreasuryRates>({
    ustbYield: 5.28,  // Default fallback
    usdcLend: 4.85,   // Default fallback
    privateCredit: 11.5, // Default fallback
    lastUpdated: new Date().toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      timeZoneName: "short" 
    }),
    isLoading: true,
    error: null,
  });

  const fetchRates = useCallback(async () => {
    setRates((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(DEFI_LLAMA_YIELDS_URL);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const pools: DeFiLlamaPool[] = data.data || [];

      // Find USDC lending rate (average of major protocols)
      const usdcPools = pools.filter(
        (p) =>
          p.symbol.toUpperCase().includes("USDC") &&
          YIELD_SOURCES.usdcLend.some((source) =>
            p.project.toLowerCase().includes(source.split("-")[0])
          ) &&
          p.tvlUsd > 10_000_000 // Only pools with >$10M TVL
      );
      const usdcLend =
        usdcPools.length > 0
          ? usdcPools.reduce((sum, p) => sum + p.apy, 0) / usdcPools.length
          : 4.85;

      // Find T-Bill yield proxies
      const ustbPools = pools.filter(
        (p) =>
          YIELD_SOURCES.ustb.some((source) =>
            p.project.toLowerCase().includes(source.split("-")[0])
          ) &&
          p.tvlUsd > 1_000_000
      );
      const ustbYield =
        ustbPools.length > 0
          ? ustbPools.reduce((sum, p) => sum + p.apy, 0) / ustbPools.length
          : 5.28;

      // Find private credit yields
      const privateCreditPools = pools.filter(
        (p) =>
          YIELD_SOURCES.privateCredit.some((source) =>
            p.project.toLowerCase().includes(source.split("-")[0])
          ) &&
          p.tvlUsd > 1_000_000
      );
      const privateCredit =
        privateCreditPools.length > 0
          ? privateCreditPools.reduce((sum, p) => sum + p.apy, 0) /
            privateCreditPools.length
          : 11.5;

      setRates({
        ustbYield: Math.round(ustbYield * 100) / 100,
        usdcLend: Math.round(usdcLend * 100) / 100,
        privateCredit: Math.round(privateCredit * 100) / 100,
        lastUpdated: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch treasury rates:", error);
      
      // Keep existing rates but mark as error
      setRates((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch rates",
      }));
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return {
    ...rates,
    refresh: fetchRates,
  };
}
