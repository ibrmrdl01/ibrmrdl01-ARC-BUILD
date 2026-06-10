"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { useEscrow } from "@/hooks/useEscrow";
import { canAssign, canFund } from "@/services/task.service";
import type { Task } from "@/types/task.types";
import { formatUSDC } from "@/utils/formatUSDC";

export function TaskCard({ task, onChanged }: { task: Task; onChanged?: () => void }) {
  const { address } = useAccount();
  const escrow = useEscrow();

  async function fund() {
    await escrow.approveAndFund(task.id, task.amount);
    onChanged?.();
  }

  async function assign() {
    await escrow.assignTask(task.id);
    onChanged?.();
  }

  return (
    <article className="card">
      <TaskStatusBadge status={task.status} />
      <h2>{task.title}</h2>
      <p className="muted">{task.detailsURI || "No invoice scope provided"}</p>
      <strong>{formatUSDC(task.amount)}</strong>
      <div className="actions">
        <Link className="button secondary" href={`/task/${task.id.toString()}`}>
          Open
        </Link>
        {canFund(task, address) && (
          <button className="button" disabled={escrow.state === "pending"} onClick={fund}>
            Approve and fund
          </button>
        )}
        {canAssign(task, address) && (
          <button className="button" disabled={escrow.state === "pending"} onClick={assign}>
            Accept invoice
          </button>
        )}
      </div>
      {escrow.message && <span className={escrow.state === "failed" ? "error" : "muted"}>{escrow.message}</span>}
      {escrow.explorerLink && (
        <a className="muted" href={escrow.explorerLink} target="_blank" rel="noreferrer">
          View transaction
        </a>
      )}
    </article>
  );
}
