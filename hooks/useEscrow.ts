"use client";

import { useState } from "react";
import { erc20Abi, parseUnits, type Address } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { getTaskEscrowAddress, taskEscrowAbi } from "@/blockchain/taskEscrow.contract";
import { getUsdcAddress } from "@/blockchain/usdc.contract";
import { ARC_TESTNET_CHAIN_ID, ERC20_USDC_DECIMALS, explorerTxUrl } from "@/config/arc";
import type { TxState } from "@/types/task.types";

export function useEscrow() {
  const publicClient = usePublicClient({ chainId: ARC_TESTNET_CHAIN_ID });
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState<TxState>("idle");
  const [message, setMessage] = useState("");
  const [lastTx, setLastTx] = useState<string>();

  async function wait(hash: `0x${string}`, label: string) {
    setLastTx(hash);
    setMessage(`${label} pending`);
    await publicClient?.waitForTransactionReceipt({ hash });
    setMessage(`${label} confirmed`);
  }

  async function run(label: string, fn: () => Promise<`0x${string}`>) {
    try {
      setState("pending");
      setMessage(`${label} requested`);
      const hash = await fn();
      await wait(hash, label);
      setState("success");
      return hash;
    } catch (error) {
      setState("failed");
      setMessage(error instanceof Error ? error.message : "Transaction failed");
      throw error;
    }
  }

  function requireEscrow() {
    const address = getTaskEscrowAddress();
    if (!address) throw new Error("NEXT_PUBLIC_TASK_ESCROW_ADDRESS is not set");
    return address;
  }

  function requireUsdc() {
    const address = getUsdcAddress();
    if (!address) throw new Error("NEXT_PUBLIC_ARC_USDC_ADDRESS is not set");
    return address;
  }

  return {
    state,
    message,
    lastTx,
    explorerLink: lastTx ? explorerTxUrl(lastTx) : undefined,
    reset: () => {
      setState("idle");
      setMessage("");
      setLastTx(undefined);
    },
    createTask: (title: string, detailsURI: string, amount: string) =>
      run("Create task", () =>
        writeContractAsync({
          address: requireEscrow(),
          abi: taskEscrowAbi,
          functionName: "createTask",
          args: [title, detailsURI, parseUnits(amount, ERC20_USDC_DECIMALS)],
        })
      ),
    approveAndFund: async (taskId: bigint, amount: bigint) => {
      const escrow = requireEscrow();
      const usdc = requireUsdc();
      await run("Approve USDC", () =>
        writeContractAsync({
          address: usdc,
          abi: erc20Abi,
          functionName: "approve",
          args: [escrow as Address, amount],
        })
      );
      return run("Fund task", () =>
        writeContractAsync({
          address: escrow,
          abi: taskEscrowAbi,
          functionName: "fundTask",
          args: [taskId],
        })
      );
    },
    assignTask: (taskId: bigint) =>
      run("Assign task", () =>
        writeContractAsync({
          address: requireEscrow(),
          abi: taskEscrowAbi,
          functionName: "assignTask",
          args: [taskId],
        })
      ),
    submitWork: (taskId: bigint, proofURI: string) =>
      run("Submit work", () =>
        writeContractAsync({
          address: requireEscrow(),
          abi: taskEscrowAbi,
          functionName: "submitWork",
          args: [taskId, proofURI],
        })
      ),
    approveTask: (taskId: bigint) =>
      run("Approve and release", () =>
        writeContractAsync({
          address: requireEscrow(),
          abi: taskEscrowAbi,
          functionName: "approveTask",
          args: [taskId],
        })
      ),
    rejectTask: (taskId: bigint, reason: string) =>
      run("Reject task", () =>
        writeContractAsync({
          address: requireEscrow(),
          abi: taskEscrowAbi,
          functionName: "rejectTask",
          args: [taskId, reason],
        })
      ),
  };
}
