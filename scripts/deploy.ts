import hre from "hardhat";

async function main() {
  const { ethers, network } = hre;

  if (network.name !== "arcTestnet" || network.config.chainId !== 5042002) {
    throw new Error("Deployment is restricted to Arc Testnet chainId 5042002");
  }

  const usdcAddress = process.env.USDC_ADDRESS;
  if (!usdcAddress) {
    throw new Error("USDC_ADDRESS is required. Verify it from official Arc contract-address docs first.");
  }

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Native gas USDC balance, 18 decimals raw: ${balance.toString()}`);
  console.log(`Arc chainId: ${network.config.chainId}`);
  console.log(`USDC ERC-20 address: ${usdcAddress}`);

  const token = await ethers.getContractAt("MockUSDC", usdcAddress);
  const decimals = await token.decimals();
  if (Number(decimals) !== 6) {
    throw new Error(`USDC decimals mismatch. Expected 6, got ${decimals.toString()}`);
  }

  const escrow = await ethers.deployContract("TaskEscrow", [usdcAddress]);
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log(`TaskEscrow deployed: ${address}`);
  console.log(`Explorer: https://testnet.arcscan.app/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
