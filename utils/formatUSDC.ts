import { formatUnits, parseUnits } from "viem";
import { ERC20_USDC_DECIMALS } from "@/config/arc";

export function formatUSDC(value: bigint) {
  return `${formatUnits(value, ERC20_USDC_DECIMALS)} USDC`;
}

export function parseUSDC(value: string) {
  return parseUnits(value || "0", ERC20_USDC_DECIMALS);
}
