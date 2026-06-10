"use client";

import { TaskCard } from "./TaskCard";
import { useTasks } from "@/hooks/useTasks";

export function TaskList() {
  const { escrowAddress, tasks, isLoading, error, refetch } = useTasks();

  if (!escrowAddress) {
    return <div className="notice">Set NEXT_PUBLIC_TASK_ESCROW_ADDRESS after deploying the invoice escrow contract.</div>;
  }

  if (isLoading) {
    return <div className="notice">Loading invoices from Arc Testnet.</div>;
  }

  if (error) {
    return <div className="notice">Invoice loading failed: {error.message}</div>;
  }

  if (!tasks.length) {
    return <div className="notice">No invoices yet. Create an invoice and fund escrow with ERC-20 USDC.</div>;
  }

  return (
    <div className="grid">
      {tasks.map((task) => (
        <TaskCard key={task.id.toString()} task={task} onChanged={refetch} />
      ))}
    </div>
  );
}
