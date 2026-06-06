export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_TESTNET_CHAIN_ID_HEX = "0x4cef52";
export const ARC_TESTNET_RPC_URL =
  process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network";
export const ARC_TESTNET_EXPLORER_URL = "https://testnet.arcscan.app";
export const ARC_TESTNET_FAUCET_URL = "https://faucet.circle.com";

export const ARC_NATIVE_USDC_DECIMALS = 18;
export const ERC20_USDC_DECIMALS = 6;

export function explorerTxUrl(hash: string) {
  return `${ARC_TESTNET_EXPLORER_URL}/tx/${hash}`;
}

export function explorerAddressUrl(address: string) {
  return `${ARC_TESTNET_EXPLORER_URL}/address/${address}`;
}
