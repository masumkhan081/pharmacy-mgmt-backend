require('dotenv').config();

(async () => {
  try {
    // Ensure a DATABASE_URL is present for the Prisma client at runtime
    process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_DEV || process.env.DIRECT_URL || process.env.DIRECT_URL_DEV;
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    await p.$connect();
    console.log('PrismaClient connected');
    const r = await p.$queryRaw`SELECT 1 as ok`;
    console.log('Query result:', r);
    await p.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error('PrismaClient error:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
