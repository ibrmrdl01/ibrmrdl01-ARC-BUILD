// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ITaskEscrow {
    enum TaskStatus {
        CREATED,
        OPEN,
        ASSIGNED,
        SUBMITTED,
        APPROVED,
        REJECTED,
        PAID,
        CANCELLED
    }

    struct Task {
        address creator;
        address executor;
        uint256 amount;
        string title;
        string detailsURI;
        string proofURI;
        TaskStatus status;
        uint64 createdAt;
        uint64 updatedAt;
    }

    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 amount, string title, string detailsURI);
    event TaskFunded(uint256 indexed taskId, address indexed creator, uint256 amount);
    event TaskAssigned(uint256 indexed taskId, address indexed executor);
    event WorkSubmitted(uint256 indexed taskId, address indexed executor, string proofURI);
    event TaskApproved(uint256 indexed taskId, address indexed creator);
    event TaskRejected(uint256 indexed taskId, address indexed creator, string reason);
    event PaymentReleased(uint256 indexed taskId, address indexed executor, uint256 amount);
    event TaskCancelled(uint256 indexed taskId, address indexed creator);

    function createTask(string calldata title, string calldata detailsURI, uint256 amount) external returns (uint256 taskId);
    function fundTask(uint256 taskId) external;
    function assignTask(uint256 taskId) external;
    function submitWork(uint256 taskId, string calldata proofURI) external;
    function approveTask(uint256 taskId) external;
    function rejectTask(uint256 taskId, string calldata reason) external;
    function cancelUnfundedTask(uint256 taskId) external;
    function releasePayment(uint256 taskId) external;
    function getTask(uint256 taskId) external view returns (Task memory);
}
