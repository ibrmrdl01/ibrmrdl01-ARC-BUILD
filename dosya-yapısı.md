# ARC Task Escrow - Dosya Yapısı

```bash
arc-task-escrow/
│
├── app/
│   ├── page.tsx
│   ├── create-task/
│   │   └── page.tsx
│   ├── task/
│   │   └── [id]/page.tsx
│
├── components/
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   ├── CreateTaskForm.tsx
│   ├── TaskStatusBadge.tsx
│   ├── WalletConnectButton.tsx
│
├── blockchain/
│   ├── arc.config.ts
│   ├── viem.client.ts
│   ├── usdc.contract.ts
│
├── contracts/
│   ├── TaskEscrow.sol
│   ├── interfaces/
│   │   └── ITaskEscrow.sol
│   ├── deploy/
│   │   └── deploy.ts
│
├── services/
│   ├── task.service.ts
│   ├── escrow.service.ts
│   ├── usdc.service.ts
│
├── hooks/
│   ├── useWallet.ts
│   ├── useArcNetwork.ts
│   ├── useTasks.ts
│   ├── useEscrow.ts
│
├── utils/
│   ├── formatUSDC.ts
│   ├── taskStatus.ts
│   ├── chainCheck.ts
│
├── tests/
│   ├── escrow.test.ts
│   ├── taskflow.test.ts
│
├── scripts/
│   ├── deploy.ts
│
├── config/
│   ├── arc.ts
│   ├── env.example
│
├── types/
│   ├── task.types.ts
│
└── README.md