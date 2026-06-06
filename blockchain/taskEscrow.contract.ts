import type { Address } from "viem";

export const taskEscrowAbi = [
  {
    type: "constructor",
    inputs: [{ name: "usdcAddress", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "taskCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createTask",
    inputs: [
      { name: "title", type: "string" },
      { name: "detailsURI", type: "string" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "taskId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fundTask",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "assignTask",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitWork",
    inputs: [
      { name: "taskId", type: "uint256" },
      { name: "proofURI", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveTask",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rejectTask",
    inputs: [
      { name: "taskId", type: "uint256" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getTask",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "creator", type: "address" },
          { name: "executor", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "title", type: "string" },
          { name: "detailsURI", type: "string" },
          { name: "proofURI", type: "string" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint64" },
          { name: "updatedAt", type: "uint64" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "TaskCreated",
    inputs: [
      { name: "taskId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "title", type: "string", indexed: false },
      { name: "detailsURI", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PaymentReleased",
    inputs: [
      { name: "taskId", type: "uint256", indexed: true },
      { name: "executor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export function getTaskEscrowAddress(): Address | undefined {
  const address = process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS;
  return address && address.startsWith("0x") ? (address as Address) : undefined;
}
