import type { Task } from "@/types/task.types";
import { TaskStatus } from "@/types/task.types";

export function canFund(task: Task, address?: string) {
  if (!address) return false;
  return task.status === TaskStatus.CREATED && task.creator.toLowerCase() === address.toLowerCase();
}

export function canAssign(task: Task, address?: string) {
  if (!address) return false;
  return (
    (task.status === TaskStatus.OPEN || task.status === TaskStatus.REJECTED) &&
    task.creator.toLowerCase() !== address.toLowerCase()
  );
}

export function canSubmit(task: Task, address?: string) {
  if (!address) return false;
  return task.status === TaskStatus.ASSIGNED && task.executor.toLowerCase() === address.toLowerCase();
}

export function canReview(task: Task, address?: string) {
  if (!address) return false;
  return task.status === TaskStatus.SUBMITTED && task.creator.toLowerCase() === address.toLowerCase();
}
