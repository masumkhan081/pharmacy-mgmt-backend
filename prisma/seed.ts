import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@pharmacy.com",
      name: "System Administrator",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
      isVerified: true,
    },
  });
  console.log("Created admin user:", admin.username);

  // 2. Create Cashier User
  const cashierPassword = await bcrypt.hash("cashier123", 10);
  const cashier = await prisma.user.upsert({
    where: { username: "cashier" },
    update: {},
    create: {
      username: "cashier",
      email: "cashier@pharmacy.com",
      name: "John Cashier",
      password: cashierPassword,
      role: "SALESMAN",
      isActive: true,
      isVerified: true,
    },
  });
  console.log("Created cashier user:", cashier.username);

  // 3. Create Demo Drugs
  const drugsData = [
    { name: "Paracetamol 500mg Tab", strength: "500mg", mrp: 1.5, purchasePrice: 0.8 },
    { name: "Amoxicillin 250mg Cap", strength: "250mg", mrp: 5.0, purchasePrice: 3.2 },
    { name: "Ibuprofen 400mg Tab", strength: "400mg", mrp: 3.0, purchasePrice: 1.5 },
    { name: "Cetirizine 10mg Tab", strength: "10mg", mrp: 2.0, purchasePrice: 0.9 },
    { name: "Omeprazole 20mg Cap", strength: "20mg", mrp: 8.0, purchasePrice: 4.5 },
  ];

  for (const drug of drugsData) {
    const createdDrug = await prisma.drug.create({
      data: {
        name: drug.name,
        strength: drug.strength,
        mrp: drug.mrp,
        purchasePrice: drug.purchasePrice,
        available: 100, // Initial stock for demo
        status: "ACTIVE",
        brandId: "6732f7b88e146777c5b1b111", // Placeholder legacy IDs
        unitId: "6732f7b88e146777c5b1b222",
        formulationId: "6732f7b88e146777c5b1b333",
      },
    });

    // 4. Create initial batches for these drugs
    await prisma.inventoryBatch.create({
      data: {
        drugId: createdDrug.id,
        batchNumber: `BCH-${Math.random().toString(36).substring(7).toUpperCase()}`,
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months later
        initialQuantity: 100,
        currentQuantity: 100,
        purchasePrice: drug.purchasePrice,
        sellingPrice: drug.mrp,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
