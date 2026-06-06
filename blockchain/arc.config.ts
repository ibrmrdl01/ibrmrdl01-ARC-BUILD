import { defineChain } from "viem";
import {
  ARC_NATIVE_USDC_DECIMALS,
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_EXPLORER_URL,
  ARC_TESTNET_RPC_URL,
} from "@/config/arc";

export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: ARC_NATIVE_USDC_DECIMALS,
  },
  rpcUrls: {
    default: {
      http: [ARC_TESTNET_RPC_URL],
      webSocket: ["wss://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arcscan Testnet",
      url: ARC_TESTNET_EXPLORER_URL,
    },
  },
  testnet: true,
});
