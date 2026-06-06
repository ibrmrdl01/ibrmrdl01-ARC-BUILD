"use client";

import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { getUsdcAddress } from "@/blockchain/usdc.contract";
import { ARC_TESTNET_FAUCET_URL, ERC20_USDC_DECIMALS } from "@/config/arc";
import { useArcNetwork } from "@/hooks/useArcNetwork";
import { useWallet } from "@/hooks/useWallet";

export function WalletConnectButton() {
  const wallet = useWallet();
  const network = useArcNetwork();
  const usdcAddress = getUsdcAddress();

  const usdcDecimals = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: Boolean(wallet.address && usdcAddress && network.isArc) },
  });

  const usdcBalance = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: wallet.address ? [wallet.address] : undefined,
    query: { enabled: Boolean(wallet.address && usdcAddress && network.isArc) },
  });

  if (!wallet.isConnected) {
    return (
      <button className="button" disabled={wallet.isConnecting} onClick={wallet.connect}>
        {wallet.isConnecting ? "Connecting" : "Connect wallet"}
      </button>
    );
  }

  return (
    <div className="stats">
      <span className="badge">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
      {!network.isArc ? (
        <button className="button" disabled={network.isSwitching} onClick={network.switchToArc}>
          Switch to Arc
        </button>
      ) : (
        <>
          <span className="badge ok">Arc Testnet</span>
          <span className="badge">
            Gas {network.nativeGas.data ? formatUnits(network.nativeGas.data.value, 18) : "0"} USDC
          </span>
          <span className={Number(usdcDecimals.data) === ERC20_USDC_DECIMALS ? "badge ok" : "badge danger"}>
            ERC-20 USDC decimals {usdcDecimals.data?.toString() || "?"}
          </span>
          <span className="badge">
            Token {typeof usdcBalance.data === "bigint" ? formatUnits(usdcBalance.data, 6) : "0"} USDC
          </span>
        </>
      )}
      <a className="button secondary" href={ARC_TESTNET_FAUCET_URL} target="_blank" rel="noreferrer">
        Faucet
      </a>
      <button className="button secondary" onClick={() => wallet.disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
