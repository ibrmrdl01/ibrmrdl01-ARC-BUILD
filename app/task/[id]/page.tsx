import Link from "next/link";
import { TaskDetail } from "@/components/TaskDetail";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <strong>Task #{id}</strong>
          <span>Proof, review, and payment release</span>
        </div>
        <WalletConnectButton />
      </header>
      <section className="content">
        <div className="toolbar">
          <h1>Task detail</h1>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>
        <TaskDetail id={BigInt(id)} />
      </section>
    </main>
  );
}
