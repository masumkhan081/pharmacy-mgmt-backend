/**
 * Lightweight operational logger for production readiness.
 * Logs critical failures to console with structured context.
 */
export const logOperationalFailure = (
  context: "SALE" | "PAYMENT" | "INVENTORY" | "ADJUSTMENT",
  error: any,
  details?: Record<string, unknown>
) => {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    level: "ERROR",
    context,
    message: error?.message || error,
    details,
  };

  // In production, this could be hooked into a file stream or a cloud logger
  console.error(`[OPERATIONAL_FAILURE][${context}]`, JSON.stringify(logMessage));
};
