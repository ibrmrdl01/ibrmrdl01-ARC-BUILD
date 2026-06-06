"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWallet() {
  const account = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    ...account,
    connect: () => connect({ connector: connectors[0] }),
    disconnect,
    isConnecting: isPending,
    connectError: error,
  };
}
