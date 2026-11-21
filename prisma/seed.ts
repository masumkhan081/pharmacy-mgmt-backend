import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

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

  // 3. Create Test Accounts for frontend quick buttons
  const testPwAdmin = await bcrypt.hash("pass.admin", 10);
  const testPwManager = await bcrypt.hash("pass.manager", 10);
  const testPwSalesman = await bcrypt.hash("pass.salesman", 10);

  await prisma.user.upsert({
    where: { email: "test.admin@gmail.com" },
    update: {},
    create: {
      username: "test.admin@gmail.com",
      email: "test.admin@gmail.com",
      name: "Admin User",
      password: testPwAdmin,
      role: "ADMIN",
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "test.manager@gmail.com" },
    update: {},
    create: {
      username: "test.manager@gmail.com",
      email: "test.manager@gmail.com",
      name: "Manager User",
      password: testPwManager,
      role: "MANAGER",
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "test.salesman@gmail.com" },
    update: {},
    create: {
      username: "test.salesman@gmail.com",
      email: "test.salesman@gmail.com",
      name: "Salesman User",
      password: testPwSalesman,
      role: "SALESMAN",
      isActive: true,
      isVerified: true,
    },
  });
  console.log("Created UI test accounts (admin, manager, salesman).");

  // 4. Create Master Catalog entities
  const unitTab = await prisma.unit.upsert({
    where: { name: "Tab" },
    update: {},
    create: { name: "Tab" },
  });

  const unitCap = await prisma.unit.upsert({
    where: { name: "Cap" },
    update: {},
    create: { name: "Cap" },
  });

  const brandSquare = await prisma.brand.upsert({
    where: { name: "Square Pharmaceuticals" },
    update: {},
    create: { name: "Square Pharmaceuticals", origin: "Bangladesh" },
  });

  const genericParacetamol = await prisma.generic.upsert({
    where: { name: "Paracetamol" },
    update: {},
    create: { name: "Paracetamol", description: "Analgesic and antipyretic" },
  });

  const formulationTablet = await prisma.formulation.upsert({
    where: { name: "Tablet" },
    update: {},
    create: { name: "Tablet" },
  });

  // 5. Create Demo Drugs
  const drugsData = [
    { name: "Paracetamol 500mg Tab", strength: 500, mrp: 1.5, purchasePrice: 0.8, unitId: unitTab.id },
    { name: "Amoxicillin 250mg Cap", strength: 250, mrp: 5.0, purchasePrice: 3.2, unitId: unitCap.id },
    { name: "Ibuprofen 400mg Tab", strength: 400, mrp: 3.0, purchasePrice: 1.5, unitId: unitTab.id },
    { name: "Cetirizine 10mg Tab", strength: 10, mrp: 2.0, purchasePrice: 0.9, unitId: unitTab.id },
    { name: "Omeprazole 20mg Cap", strength: 20, mrp: 8.0, purchasePrice: 4.5, unitId: unitCap.id },
  ];

  for (const drug of drugsData) {
    const existing = await prisma.drug.findFirst({ where: { name: drug.name } });
    const createdDrug = existing || await prisma.drug.create({
      data: {
        name: drug.name,
        strength: drug.strength,
        mrp: drug.mrp,
        purchasePrice: drug.purchasePrice,
        available: 100, // Initial stock for demo
        status: "ACTIVE",
        brandId: brandSquare.id,
        unitId: drug.unitId,
        formulationId: formulationTablet.id,
        genericId: genericParacetamol.id,
      },
    });

    // Create initial batch for each demo drug
    const batchNum = `BCH-${drug.name.substring(0, 3).toUpperCase()}-001`;
    const existingBatch = await prisma.inventoryBatch.findFirst({
      where: { drugId: createdDrug.id, batchNumber: batchNum },
    });

    if (!existingBatch) {
      await prisma.inventoryBatch.create({
        data: {
          drugId: createdDrug.id,
          batchNumber: batchNum,
          expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months later
          initialQuantity: 100,
          currentQuantity: 100,
          purchasePrice: drug.purchasePrice,
          sellingPrice: drug.mrp,
          status: "AVAILABLE",
          isActive: true,
        },
      });
    }
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
