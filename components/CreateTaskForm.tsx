"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEscrow } from "@/hooks/useEscrow";
import { buildAiExecutorHint } from "@/services/ai.executor";

export function CreateTaskForm() {
  const router = useRouter();
  const escrow = useEscrow();
  const [title, setTitle] = useState("");
  const [detailsURI, setDetailsURI] = useState("");
  const [amount, setAmount] = useState("");
  const aiHint = title ? buildAiExecutorHint(title, detailsURI) : "";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await escrow.createTask(title, detailsURI, amount);
    router.push("/");
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="title">Invoice title</label>
        <input id="title" required placeholder="Design sprint invoice" value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="details">Scope, deliverables, or URI</label>
        <textarea id="details" value={detailsURI} onChange={(event) => setDetailsURI(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="amount">Invoice amount, ERC-20 USDC with 6 decimals</label>
        <input
          id="amount"
          inputMode="decimal"
          pattern="^[0-9]+(\\.[0-9]{1,6})?$"
          placeholder="25.00"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      {aiHint && (
        <div className="panel">
          <h2>Delivery agent brief</h2>
          <pre className="muted">{aiHint}</pre>
        </div>
      )}
      <button className="button" disabled={escrow.state === "pending"} type="submit">
        Create invoice
      </button>
      {escrow.message && <span className={escrow.state === "failed" ? "error" : "muted"}>{escrow.message}</span>}
      {escrow.explorerLink && (
        <a className="muted" href={escrow.explorerLink} target="_blank" rel="noreferrer">
          View transaction
        </a>
      )}
    </form>
  );
}
