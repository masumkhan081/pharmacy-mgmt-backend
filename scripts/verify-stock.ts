import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyStockIntegrity() {
  console.log("Starting Stock Integrity Verification...");
  console.log("---------------------------------------");

  try {
    const drugs = await prisma.drug.findMany({
      include: {
        batches: {
          where: {
            isActive: true,
            expirationDate: { gt: new Date() },
            currentQuantity: { gt: 0 }
          }
        }
      }
    });

    let mismatchCount = 0;

    for (const drug of drugs) {
      const batchSum = drug.batches.reduce((sum, b) => sum + b.currentQuantity, 0);
      
      if (Math.abs(batchSum - drug.available) > 0.0001) {
        console.error(`[MISMATCH] Drug: ${drug.name} (${drug.id})`);
        console.error(`  - Cached Available: ${drug.available}`);
        console.error(`  - Sum of Batches:   ${batchSum}`);
        console.error(`  - Delta:            ${(batchSum - drug.available).toFixed(4)}`);
        mismatchCount++;
      }
    }

    if (mismatchCount === 0) {
      console.log("✅ Success: All drug availability values match batch totals.");
    } else {
      console.error(`❌ Failure: Found ${mismatchCount} drugs with stock drift.`);
    }

  } catch (error) {
    console.error("Verification script failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyStockIntegrity();
