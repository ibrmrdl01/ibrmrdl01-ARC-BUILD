import { createPublicClient, http } from "viem";
import { arcTestnet } from "./arc.config";

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});
