import { TaskStatus } from "@/types/task.types";

export function taskStatusLabel(status: TaskStatus) {
  return (
    {
      [TaskStatus.CREATED]: "Created",
      [TaskStatus.OPEN]: "Open",
      [TaskStatus.ASSIGNED]: "Assigned",
      [TaskStatus.SUBMITTED]: "Submitted",
      [TaskStatus.APPROVED]: "Approved",
      [TaskStatus.REJECTED]: "Rejected",
      [TaskStatus.PAID]: "Paid",
      [TaskStatus.CANCELLED]: "Cancelled",
    } satisfies Record<TaskStatus, string>
  )[status];
}
