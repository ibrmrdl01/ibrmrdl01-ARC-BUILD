// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ITaskEscrow} from "./interfaces/ITaskEscrow.sol";

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IERC20Metadata {
    function decimals() external view returns (uint8);
}

contract TaskEscrow is ITaskEscrow {
    error AmountMustBePositive();
    error EmptyTitle();
    error InvalidTask();
    error InvalidStatus(TaskStatus current);
    error NotCreator();
    error NotExecutor();
    error CreatorCannotExecute();
    error TransferFailed();
    error ReentrantCall();
    error InvalidUsdcDecimals(uint8 decimals);

    IERC20 public immutable usdc;
    uint256 public taskCount;

    mapping(uint256 => Task) private tasks;
    uint256 private locked;

    modifier nonReentrant() {
        if (locked == 1) revert ReentrantCall();
        locked = 1;
        _;
        locked = 0;
    }

    modifier onlyCreator(uint256 taskId) {
        if (tasks[taskId].creator != msg.sender) revert NotCreator();
        _;
    }

    modifier onlyExecutor(uint256 taskId) {
        if (tasks[taskId].executor != msg.sender) revert NotExecutor();
        _;
    }

    constructor(address usdcAddress) {
        uint8 decimals = IERC20Metadata(usdcAddress).decimals();
        if (decimals != 6) revert InvalidUsdcDecimals(decimals);
        usdc = IERC20(usdcAddress);
    }

    function createTask(
        string calldata title,
        string calldata detailsURI,
        uint256 amount
    ) external returns (uint256 taskId) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (amount == 0) revert AmountMustBePositive();

        taskId = ++taskCount;
        tasks[taskId] = Task({
            creator: msg.sender,
            executor: address(0),
            amount: amount,
            title: title,
            detailsURI: detailsURI,
            proofURI: "",
            status: TaskStatus.CREATED,
            createdAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp)
        });

        emit TaskCreated(taskId, msg.sender, amount, title, detailsURI);
    }

    function fundTask(uint256 taskId) external nonReentrant onlyCreator(taskId) {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.CREATED) revert InvalidStatus(task.status);

        task.status = TaskStatus.OPEN;
        task.updatedAt = uint64(block.timestamp);

        bool ok = usdc.transferFrom(msg.sender, address(this), task.amount);
        if (!ok) revert TransferFailed();

        emit TaskFunded(taskId, msg.sender, task.amount);
    }

    function assignTask(uint256 taskId) external {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.OPEN && task.status != TaskStatus.REJECTED) {
            revert InvalidStatus(task.status);
        }
        if (task.creator == msg.sender) revert CreatorCannotExecute();

        task.executor = msg.sender;
        task.status = TaskStatus.ASSIGNED;
        task.proofURI = "";
        task.updatedAt = uint64(block.timestamp);

        emit TaskAssigned(taskId, msg.sender);
    }

    function submitWork(uint256 taskId, string calldata proofURI) external onlyExecutor(taskId) {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.ASSIGNED) revert InvalidStatus(task.status);

        task.proofURI = proofURI;
        task.status = TaskStatus.SUBMITTED;
        task.updatedAt = uint64(block.timestamp);

        emit WorkSubmitted(taskId, msg.sender, proofURI);
    }

    function approveTask(uint256 taskId) external onlyCreator(taskId) {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.SUBMITTED) revert InvalidStatus(task.status);

        task.status = TaskStatus.APPROVED;
        task.updatedAt = uint64(block.timestamp);

        emit TaskApproved(taskId, msg.sender);
        _releasePayment(taskId, task);
    }

    function rejectTask(uint256 taskId, string calldata reason) external onlyCreator(taskId) {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.SUBMITTED) revert InvalidStatus(task.status);

        task.status = TaskStatus.REJECTED;
        task.updatedAt = uint64(block.timestamp);

        emit TaskRejected(taskId, msg.sender, reason);
    }

    function cancelUnfundedTask(uint256 taskId) external onlyCreator(taskId) {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.CREATED) revert InvalidStatus(task.status);

        task.status = TaskStatus.CANCELLED;
        task.updatedAt = uint64(block.timestamp);

        emit TaskCancelled(taskId, msg.sender);
    }

    function releasePayment(uint256 taskId) external {
        Task storage task = _task(taskId);
        if (task.status != TaskStatus.APPROVED) revert InvalidStatus(task.status);
        _releasePayment(taskId, task);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        return _task(taskId);
    }

    function _releasePayment(uint256 taskId, Task storage task) private nonReentrant {
        address executor = task.executor;
        uint256 amount = task.amount;
        if (executor == address(0)) revert NotExecutor();

        task.status = TaskStatus.PAID;
        task.updatedAt = uint64(block.timestamp);

        bool ok = usdc.transfer(executor, amount);
        if (!ok) revert TransferFailed();

        emit PaymentReleased(taskId, executor, amount);
    }

    function _task(uint256 taskId) private view returns (Task storage task) {
        task = tasks[taskId];
        if (task.creator == address(0)) revert InvalidTask();
    }
}
