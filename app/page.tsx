import Link from "next/link";
import { TaskList } from "@/components/TaskList";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <strong>Arc USDC Invoice & Escrow</strong>
          <span>Arc Testnet only, native gas and escrow settled in USDC</span>
        </div>
        <WalletConnectButton />
      </header>
      <section className="content">
        <div className="toolbar">
          <div>
            <h1>Invoices</h1>
            <p className="muted">Fund an invoice into escrow, review delivery proof, then release USDC.</p>
          </div>
          <Link className="button" href="/create-task">
            New invoice
          </Link>
        </div>
        <TaskList />
      </section>
    </main>
  );
}
