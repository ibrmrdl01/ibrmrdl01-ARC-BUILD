import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("TaskEscrow", function () {
  async function deployFixture() {
    const [creator, executor, other] = await ethers.getSigners();
    const usdc = (await ethers.deployContract("MockUSDC")) as any;
    const escrow = (await ethers.deployContract("TaskEscrow", [await usdc.getAddress()])) as any;
    await usdc.mint(creator.address, 1_000_000_000n);

    return { creator, executor, other, usdc, escrow };
  }

  it("creates and funds a task with 6-decimal USDC", async function () {
    const { creator, usdc, escrow } = await deployFixture();
    const amount = 25_000_000n;

    await expect(escrow.connect(creator).createTask("Build UI", "ipfs://details", amount))
      .to.emit(escrow, "TaskCreated")
      .withArgs(1, creator.address, amount, "Build UI", "ipfs://details");

    await usdc.connect(creator).approve(await escrow.getAddress(), amount);

    await expect(escrow.connect(creator).fundTask(1))
      .to.emit(escrow, "TaskFunded")
      .withArgs(1, creator.address, amount);

    expect(await usdc.balanceOf(await escrow.getAddress())).to.equal(amount);
    const task = await escrow.getTask(1);
    expect(task.status).to.equal(1);
  });

  it("locks funds until creator approval, then releases to executor", async function () {
    const { creator, executor, usdc, escrow } = await deployFixture();
    const amount = 40_000_000n;

    await escrow.connect(creator).createTask("Write report", "requirements", amount);
    await usdc.connect(creator).approve(await escrow.getAddress(), amount);
    await escrow.connect(creator).fundTask(1);
    await escrow.connect(executor).assignTask(1);
    await escrow.connect(executor).submitWork(1, "ipfs://proof");

    expect(await usdc.balanceOf(executor.address)).to.equal(0);

    await expect(escrow.connect(creator).approveTask(1))
      .to.emit(escrow, "PaymentReleased")
      .withArgs(1, executor.address, amount);

    expect(await usdc.balanceOf(executor.address)).to.equal(amount);
    const task = await escrow.getTask(1);
    expect(task.status).to.equal(6);
  });

  it("lets creator reject submitted work without releasing funds", async function () {
    const { creator, executor, usdc, escrow } = await deployFixture();
    const amount = 15_000_000n;

    await escrow.connect(creator).createTask("Audit", "scope", amount);
    await usdc.connect(creator).approve(await escrow.getAddress(), amount);
    await escrow.connect(creator).fundTask(1);
    await escrow.connect(executor).assignTask(1);
    await escrow.connect(executor).submitWork(1, "weak proof");

    await expect(escrow.connect(creator).rejectTask(1, "Incomplete")).to.emit(escrow, "TaskRejected");

    expect(await usdc.balanceOf(executor.address)).to.equal(0);
    expect(await usdc.balanceOf(await escrow.getAddress())).to.equal(amount);
    const task = await escrow.getTask(1);
    expect(task.status).to.equal(5);
  });

  it("blocks non-creators from approving", async function () {
    const { creator, executor, other, usdc, escrow } = await deployFixture();
    const amount = 10_000_000n;

    await escrow.connect(creator).createTask("Ship", "scope", amount);
    await usdc.connect(creator).approve(await escrow.getAddress(), amount);
    await escrow.connect(creator).fundTask(1);
    await escrow.connect(executor).assignTask(1);
    await escrow.connect(executor).submitWork(1, "done");

    await expect(escrow.connect(other).approveTask(1)).to.be.revertedWithCustomError(escrow, "NotCreator");
  });

  it("prevents the creator from taking their own task", async function () {
    const { creator, usdc, escrow } = await deployFixture();
    const amount = 10_000_000n;

    await escrow.connect(creator).createTask("Self task", "scope", amount);
    await usdc.connect(creator).approve(await escrow.getAddress(), amount);
    await escrow.connect(creator).fundTask(1);

    await expect(escrow.connect(creator).assignTask(1)).to.be.revertedWithCustomError(escrow, "CreatorCannotExecute");
  });
});
