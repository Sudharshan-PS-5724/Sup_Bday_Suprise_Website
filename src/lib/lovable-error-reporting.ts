/**
 * Independent runtime error logger.
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    console.error("[Runtime Error]", error, context);
  }
}
