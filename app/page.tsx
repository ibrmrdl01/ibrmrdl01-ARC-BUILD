import Link from "next/link";
import { TaskList } from "@/components/TaskList";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <strong>Arc Task Escrow</strong>
          <span>Arc Testnet only, gas paid in USDC</span>
        </div>
        <WalletConnectButton />
      </header>
      <section className="content">
        <div className="toolbar">
          <div>
            <h1>Tasks</h1>
            <p className="muted">Funds remain locked until the creator approves submitted work.</p>
          </div>
          <Link className="button" href="/create-task">
            Create task
          </Link>
        </div>
        <TaskList />
      </section>
    </main>
  );
}
