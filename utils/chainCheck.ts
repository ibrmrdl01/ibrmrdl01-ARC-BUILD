import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";

export function isArcTestnet(chainId?: number) {
  return chainId === ARC_TESTNET_CHAIN_ID;
}
