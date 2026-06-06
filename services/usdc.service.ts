import { erc20Abi, type Address, type PublicClient } from "viem";
import { ERC20_USDC_DECIMALS } from "@/config/arc";

export async function verifyUsdcDecimals(publicClient: PublicClient, usdcAddress: Address) {
  const decimals = await publicClient.readContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  return Number(decimals) === ERC20_USDC_DECIMALS;
}

export async function readUsdcBalance(publicClient: PublicClient, usdcAddress: Address, account: Address) {
  return publicClient.readContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
  });
}
