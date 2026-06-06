"use client";

import { TaskCard } from "./TaskCard";
import { useTasks } from "@/hooks/useTasks";

export function TaskList() {
  const { escrowAddress, tasks, isLoading, error, refetch } = useTasks();

  if (!escrowAddress) {
    return <div className="notice">Set NEXT_PUBLIC_TASK_ESCROW_ADDRESS after deploying the contract.</div>;
  }

  if (isLoading) {
    return <div className="notice">Loading tasks from Arc Testnet.</div>;
  }

  if (error) {
    return <div className="notice">Task loading failed: {error.message}</div>;
  }

  if (!tasks.length) {
    return <div className="notice">No tasks yet. Create a task and fund escrow with ERC-20 USDC.</div>;
  }

  return (
    <div className="grid">
      {tasks.map((task) => (
        <TaskCard key={task.id.toString()} task={task} onChanged={refetch} />
      ))}
    </div>
  );
}
