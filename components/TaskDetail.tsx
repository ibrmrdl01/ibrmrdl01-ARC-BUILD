"use client";

import { useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { getTaskEscrowAddress, taskEscrowAbi } from "@/blockchain/taskEscrow.contract";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { useEscrow } from "@/hooks/useEscrow";
import { canAssign, canFund, canReview, canSubmit } from "@/services/task.service";
import { TaskStatus, type Task } from "@/types/task.types";
import { formatUSDC } from "@/utils/formatUSDC";

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

export function TaskDetail({ id }: { id: bigint }) {
  const { address } = useAccount();
  const escrowAddress = getTaskEscrowAddress();
  const escrow = useEscrow();
  const [proofURI, setProofURI] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const taskRead = useReadContract({
    address: escrowAddress,
    abi: taskEscrowAbi,
    functionName: "getTask",
    args: [id],
    query: { enabled: Boolean(escrowAddress) },
  });

  const task = useMemo(() => {
    return Array.isArray(taskRead.data) ? mapTask(id, taskRead.data) : undefined;
  }, [id, taskRead.data]);

  async function refreshAfter(action: Promise<unknown>) {
    await action;
    await taskRead.refetch();
  }

  if (!escrowAddress) {
    return <div className="notice">Set NEXT_PUBLIC_TASK_ESCROW_ADDRESS after deployment.</div>;
  }

  if (taskRead.isLoading) {
    return <div className="notice">Loading task from Arc Testnet.</div>;
  }

  if (taskRead.error || !task) {
    return <div className="notice">Task not found or could not be loaded.</div>;
  }

  return (
    <div className="panel">
      <div className="toolbar">
        <div>
          <TaskStatusBadge status={task.status} />
          <h1>{task.title}</h1>
          <p className="muted">{task.detailsURI || "No details URI provided"}</p>
        </div>
        <strong>{formatUSDC(task.amount)}</strong>
      </div>

      <div className="grid">
        <div>
          <p className="muted">Creator</p>
          <p>{task.creator}</p>
        </div>
        <div>
          <p className="muted">Executor</p>
          <p>{task.executor === "0x0000000000000000000000000000000000000000" ? "Unassigned" : task.executor}</p>
        </div>
        <div>
          <p className="muted">Proof</p>
          <p>{task.proofURI || "No proof submitted"}</p>
        </div>
      </div>

      <div className="actions">
        {canFund(task, address) && (
          <button className="button" disabled={escrow.state === "pending"} onClick={() => refreshAfter(escrow.approveAndFund(task.id, task.amount))}>
            Fund escrow
          </button>
        )}
        {canAssign(task, address) && (
          <button className="button" disabled={escrow.state === "pending"} onClick={() => refreshAfter(escrow.assignTask(task.id))}>
            Take task
          </button>
        )}
      </div>

      {canSubmit(task, address) && (
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            void refreshAfter(escrow.submitWork(task.id, proofURI));
          }}
        >
          <div className="field">
            <label htmlFor="proof">Proof URI or proof text</label>
            <textarea id="proof" required value={proofURI} onChange={(event) => setProofURI(event.target.value)} />
          </div>
          <button className="button" disabled={escrow.state === "pending"} type="submit">
            Submit proof
          </button>
        </form>
      )}

      {canReview(task, address) && (
        <div className="form">
          <button className="button" disabled={escrow.state === "pending"} onClick={() => refreshAfter(escrow.approveTask(task.id))}>
            Approve and release USDC
          </button>
          <div className="field">
            <label htmlFor="reject">Reject reason</label>
            <input id="reject" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
          </div>
          <button className="button danger" disabled={escrow.state === "pending"} onClick={() => refreshAfter(escrow.rejectTask(task.id, rejectReason || "Rejected"))}>
            Reject work
          </button>
        </div>
      )}

      {escrow.message && <p className={escrow.state === "failed" ? "error" : "muted"}>{escrow.message}</p>}
      {escrow.explorerLink && (
        <a className="muted" href={escrow.explorerLink} target="_blank" rel="noreferrer">
          View transaction
        </a>
      )}
    </div>
  );
}
