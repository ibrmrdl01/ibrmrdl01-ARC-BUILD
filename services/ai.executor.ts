export function buildAiExecutorHint(title: string, details: string) {
  return [
    `Task: ${title}`,
    "Executor checklist:",
    "- Read the task requirements and acceptance criteria.",
    "- Produce a concrete deliverable.",
    "- Submit a proof URI or concise proof text that the creator can audit.",
    `Context: ${details}`,
  ].join("\n");
}
