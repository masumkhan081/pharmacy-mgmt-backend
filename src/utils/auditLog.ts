import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export interface AuditLogParams {
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  tx?: Prisma.TransactionClient;
}

/**
 * Centralized utility to track operational history and mutations (Prisma version).
 * If provided with a tx, the audit log creation is included in the PostgreSQL transaction.
 */
export const createAuditLog = async ({
  actor,
  action,
  entityType,
  entityId,
  before,
  after,
  tx,
}: AuditLogParams) => {
  const client = tx || prisma;

  if (!actor) {
    console.warn(`[AuditLog] Missing actor for action ${action} on ${entityType} ${entityId}`);
    return;
  }

  await client.auditLog.create({
    data: {
      actorId: actor,
      action,
      entityType,
      entityId,
      before: before ? (before as Prisma.InputJsonValue) : undefined,
      after: after ? (after as Prisma.InputJsonValue) : undefined,
    },
  });
};
