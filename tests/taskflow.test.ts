import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("Task flow lifecycle", function () {
  it("moves through CREATED, OPEN, ASSIGNED, SUBMITTED, PAID", async function () {
    const [creator, executor] = await ethers.getSigners();
    const usdc = (await ethers.deployContract("MockUSDC")) as any;
    const escrow = (await ethers.deployContract("TaskEscrow", [await usdc.getAddress()])) as any;
    const amount = 99_500_000n;

    await usdc.mint(creator.address, amount);
    await escrow.connect(creator).createTask("End-to-end task", "details", amount);
    expect((await escrow.getTask(1)).status).to.equal(0);

    await usdc.connect(creator).approve(await escrow.getAddress(), amount);
    await escrow.connect(creator).fundTask(1);
    expect((await escrow.getTask(1)).status).to.equal(1);

    await escrow.connect(executor).assignTask(1);
    expect((await escrow.getTask(1)).status).to.equal(2);

    await escrow.connect(executor).submitWork(1, "proof");
    expect((await escrow.getTask(1)).status).to.equal(3);

    await escrow.connect(creator).approveTask(1);
    expect((await escrow.getTask(1)).status).to.equal(6);
    expect(await usdc.balanceOf(executor.address)).to.equal(amount);
  });
});
