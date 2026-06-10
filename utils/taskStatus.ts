import { TaskStatus } from "@/types/task.types";

export function taskStatusLabel(status: TaskStatus) {
  return (
    {
      [TaskStatus.CREATED]: "Created",
      [TaskStatus.OPEN]: "Escrow funded",
      [TaskStatus.ASSIGNED]: "Accepted",
      [TaskStatus.SUBMITTED]: "In review",
      [TaskStatus.APPROVED]: "Approved",
      [TaskStatus.REJECTED]: "Revision requested",
      [TaskStatus.PAID]: "Paid",
      [TaskStatus.CANCELLED]: "Cancelled",
    } satisfies Record<TaskStatus, string>
  )[status];
}
