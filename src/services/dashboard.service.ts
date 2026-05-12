import prisma from "../lib/prisma";
import Invoice from "../models/invoice.model";

const getOperationalStats = async () => {
  const now = new Date();
  
  // Today's boundaries
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Expiry threshold (e.g., 90 days from now)
  const expiryThreshold = new Date(now);
  expiryThreshold.setDate(expiryThreshold.getDate() + 90);

  const lowStockThreshold = 10;

  const [
    todaySales,
    lowStockCount,
    expiringCount,
    unpaidInvoicesCount
  ] = await Promise.all([
    // 1. Today's total sales amount (Prisma)
    prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
        isDeleted: false,
      },
      _sum: {
        totalBill: true,
      },
    }),

    // 2. Count of drugs with low stock (Prisma)
    prisma.drug.count({
      where: {
        available: { lte: lowStockThreshold },
        isDeleted: false,
      },
    }),

    // 3. Count of batches expiring soon (Prisma)
    prisma.inventoryBatch.count({
      where: {
        expirationDate: {
          lte: expiryThreshold,
          gt: now,
        },
        currentQuantity: { gt: 0 },
        isActive: true,
      },
    }),

    // 4. Unpaid Invoices count (MongoDB - Legacy)
    Invoice.countDocuments({
      status: { $in: ["UNPAID", "PARTIALLY_PAID"] },
      isDeleted: false
    })
  ]);

  return {
    todaySalesAmount: todaySales?._sum?.totalBill || 0,
    lowStockCount,
    expiringBatchesCount: expiringCount,
    unpaidInvoicesCount
  };
};

export default {
  getOperationalStats,
};
