import type { Address } from "viem";

export enum TaskStatus {
  CREATED = 0,
  OPEN = 1,
  ASSIGNED = 2,
  SUBMITTED = 3,
  APPROVED = 4,
  REJECTED = 5,
  PAID = 6,
  CANCELLED = 7,
}

export type Task = {
  id: bigint;
  creator: Address;
  executor: Address;
  amount: bigint;
  title: string;
  detailsURI: string;
  proofURI: string;
  status: TaskStatus;
  createdAt: bigint;
  updatedAt: bigint;
};

export type TxState = "idle" | "pending" | "success" | "failed";
