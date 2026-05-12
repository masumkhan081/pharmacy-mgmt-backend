import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton instance for parallel persistence layer.
 * Note: In Prisma 7, datasource configuration is managed in prisma.config.ts
 */
const prisma = new PrismaClient();

export default prisma;
