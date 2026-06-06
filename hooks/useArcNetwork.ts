"use client";

import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/blockchain/arc.config";
import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";
import { isArcTestnet } from "@/utils/chainCheck";

export function useArcNetwork() {
  const { address, chainId } = useAccount();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();
  const nativeGas = useBalance({
    address,
    chainId: ARC_TESTNET_CHAIN_ID,
    query: { enabled: Boolean(address) },
  });

  return {
    chainId,
    isArc: isArcTestnet(chainId),
    nativeGas,
    isSwitching,
    switchError,
    switchToArc: () => switchChain({ chainId: arcTestnet.id }),
  };
}
