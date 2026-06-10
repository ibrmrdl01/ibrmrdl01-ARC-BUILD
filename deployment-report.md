# Arc Testnet Deployment Report

Status: Deployed to Arc Testnet on 2026-06-10.

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

## Deployment Result

- Deployer: `0x031c5B0922c3d04024A5C2bA72f961d732191b04`
- TaskEscrow address: `0x90F707e74E36A14Ff44477118E7c35bFfEb2F300`
- Arcscan contract link: `https://testnet.arcscan.app/address/0x90F707e74E36A14Ff44477118E7c35bFfEb2F300`
- Frontend URL:
- Test result: `npm test` passed, 6 tests.
- Typecheck result: `npm run typecheck` passed.
- Build result: `npm run build` passed.

## Validation Checklist

- Chain ID is `5042002`.
- Native balance is USDC, not ETH.
- ERC-20 USDC decimals return `6`.
- Escrow address is set in `NEXT_PUBLIC_TASK_ESCROW_ADDRESS`.
- Compatibility escrow address is set in `VITE_ARC_JOB_BOARD_ADDRESS`.
- UI shows transaction pending, success, failure, and explorer links.
