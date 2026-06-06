# Arc Task Escrow

Full-stack decentralized task escrow for Arc Testnet.

## Arc Rules

- Chain: Arc Testnet only, chain ID `5042002`.
- Native gas token: USDC with 18 decimals.
- Escrow token: ERC-20 USDC with 6 decimals.
- Escrow contract address is never assumed. Set it after deployment with `NEXT_PUBLIC_TASK_ESCROW_ADDRESS`.
- ERC-20 USDC address must be verified against official Arc contract-address docs before deployment.

## Setup

```bash
npm install
copy config\env.example .env
```

Fill `.env` with a testnet private key and verified contract addresses.

## Test

```bash
npm test
npm run typecheck
npm run build
```

## Deploy Contract To Arc Testnet

```bash
npm run deploy:arc
```

After deployment, set:

```env
NEXT_PUBLIC_TASK_ESCROW_ADDRESS=0x...
```

## Run Frontend

```bash
npm run dev
```

Open `http://localhost:3000`.

## User Flow

1. Connect wallet.
2. Switch to Arc Testnet.
3. Verify native gas USDC and ERC-20 USDC balances.
4. Create task.
5. Approve ERC-20 USDC and fund escrow.
6. Executor takes task.
7. Executor submits proof.
8. Creator approves or rejects.
9. Approval releases USDC to executor automatically.
