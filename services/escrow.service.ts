import type { Address, PublicClient } from "viem";
import { taskEscrowAbi } from "@/blockchain/taskEscrow.contract";

export async function readTaskCount(publicClient: PublicClient, escrowAddress: Address) {
  return publicClient.readContract({
    address: escrowAddress,
    abi: taskEscrowAbi,
    functionName: "taskCount",
  });
}

export async function readTask(publicClient: PublicClient, escrowAddress: Address, taskId: bigint) {
  return publicClient.readContract({
    address: escrowAddress,
    abi: taskEscrowAbi,
    functionName: "getTask",
    args: [taskId],
  });
}
