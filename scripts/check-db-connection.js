require('dotenv').config();

(async () => {
  try {
    const prisma = require('../dist/lib/prisma').default || require('../src/lib/prisma').default;
    await prisma.$connect();
    console.log('PrismaClient connected successfully');
    const r = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('Query result:', r);
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error('PrismaClient error:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
