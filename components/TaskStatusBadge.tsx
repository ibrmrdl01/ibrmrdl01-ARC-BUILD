import { TaskStatus } from "@/types/task.types";
import { taskStatusLabel } from "@/utils/taskStatus";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const tone =
    status === TaskStatus.PAID || status === TaskStatus.OPEN
      ? "ok"
      : status === TaskStatus.REJECTED || status === TaskStatus.CANCELLED
        ? "danger"
        : "warn";

  return <span className={`badge ${tone}`}>{taskStatusLabel(status)}</span>;
}
