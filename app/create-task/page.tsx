import Link from "next/link";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function CreateTaskPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <strong>New escrow task</strong>
          <span>ERC-20 USDC is locked after funding</span>
        </div>
        <WalletConnectButton />
      </header>
      <section className="content">
        <div className="toolbar">
          <div>
            <h1>Create task</h1>
            <p className="muted">Create first, then fund escrow from the task card.</p>
          </div>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>
        <div className="panel">
          <CreateTaskForm />
        </div>
      </section>
    </main>
  );
}
