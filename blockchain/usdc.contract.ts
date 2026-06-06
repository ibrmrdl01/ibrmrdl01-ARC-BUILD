import { erc20Abi, type Address } from "viem";

export const usdcAbi = erc20Abi;

export function getUsdcAddress(): Address | undefined {
  const address = process.env.NEXT_PUBLIC_ARC_USDC_ADDRESS;
  return address && address.startsWith("0x") ? (address as Address) : undefined;
}
