# Arc Testnet Deployment Report

Status: Prepared and locally validated, not deployed from this environment.

## Architecture

- Frontend: Next.js App Router, Wagmi, Viem, injected wallet connector.
- Chain: Arc Testnet, chain ID `5042002`.
- Gas: native USDC, displayed with 18 decimals.
- Escrow asset: ERC-20 USDC, verified at runtime with `decimals() == 6`.
- Contract: `TaskEscrow`, deployed with a verified USDC ERC-20 address.
- Tests: Hardhat unit tests for lifecycle, rejection, access control, and payment release.

## Deployment Inputs

- `ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network`
- `USDC_ADDRESS` must be verified from official Arc contract-address documentation before deployment.
- `PRIVATE_KEY` must be a testnet key with native gas USDC.

## Deployment Command

```bash
npm run deploy:arc
```

## Report Fields To Fill After Deployment

- Deployer:
- TaskEscrow address:
- Arcscan contract link:
- Frontend URL:
- Test result: `npm test` passed, 6 tests.
- Typecheck result: `npm run typecheck` passed.
- Build result: `npm run build` passed.

## Validation Checklist

- Chain ID is `5042002`.
- Native balance is USDC, not ETH.
- ERC-20 USDC decimals return `6`.
- Escrow address is set in `NEXT_PUBLIC_TASK_ESCROW_ADDRESS`.
- UI shows transaction pending, success, failure, and explorer links.
