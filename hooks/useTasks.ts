"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { getTaskEscrowAddress, taskEscrowAbi } from "@/blockchain/taskEscrow.contract";
import { TaskStatus, type Task } from "@/types/task.types";

function mapTask(id: bigint, raw: readonly unknown[]): Task {
  return {
    id,
    creator: raw[0] as Task["creator"],
    executor: raw[1] as Task["executor"],
    amount: raw[2] as bigint,
    title: raw[3] as string,
    detailsURI: raw[4] as string,
    proofURI: raw[5] as string,
    status: Number(raw[6]) as TaskStatus,
    createdAt: raw[7] as bigint,
    updatedAt: raw[8] as bigint,
  };
}

export function useTasks() {
  const escrowAddress = getTaskEscrowAddress();
  const count = useReadContract({
    address: escrowAddress,
    abi: taskEscrowAbi,
    functionName: "taskCount",
    query: { enabled: Boolean(escrowAddress) },
  });

  const ids = useMemo(() => {
    const value = typeof count.data === "bigint" ? count.data : 0n;
    return Array.from({ length: Number(value) }, (_, index) => BigInt(index + 1));
  }, [count.data]);

  const reads = useReadContracts({
    contracts: ids.map((id) => ({
      address: escrowAddress,
      abi: taskEscrowAbi,
      functionName: "getTask",
      args: [id],
    })),
    query: { enabled: Boolean(escrowAddress) && ids.length > 0 },
  });

  const tasks = useMemo(() => {
    return (reads.data || [])
      .map((result, index) => {
        if (result.status !== "success" || !Array.isArray(result.result)) return undefined;
        return mapTask(ids[index], result.result);
      })
      .filter(Boolean)
      .reverse() as Task[];
  }, [ids, reads.data]);

  return {
    escrowAddress,
    tasks,
    count: count.data || 0n,
    isLoading: count.isLoading || reads.isLoading,
    error: count.error || reads.error,
    refetch: async () => {
      await count.refetch();
      await reads.refetch();
    },
  };
}
