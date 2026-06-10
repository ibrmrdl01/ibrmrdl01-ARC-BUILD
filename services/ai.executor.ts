export function buildAiExecutorHint(title: string, details: string) {
  return [
    `Invoice: ${title}`,
    "Provider checklist:",
    "- Read the invoice scope and acceptance criteria.",
    "- Produce the agreed deliverable.",
    "- Submit a delivery proof URI or concise proof text that the payer can audit.",
    `Context: ${details}`,
  ].join("\n");
}
