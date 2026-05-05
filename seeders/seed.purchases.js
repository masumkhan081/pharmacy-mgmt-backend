const {
  log,
  pickMany,
  randDate,
  randFloat,
  randInt,
  requireModel,
  runSeeder,
} = require("./seed.shared");
const seedDrugs = require("./seed.drugs");

const drugModel = requireModel("drug");
const purchaseModel = requireModel("purchase");

const COUNT = 25;

async function seedPurchases() {
  if ((await drugModel.countDocuments()) === 0) {
    log("purchases", "no drugs found, seeding drugs first");
    await seedDrugs();
  }

  const drugs = await drugModel.find().lean();
  if (!drugs.length) {
    log("purchases", "drug pool empty, aborting");
    return;
  }

  const existing = await purchaseModel.countDocuments();
  if (existing >= COUNT) {
    log("purchases", `${existing} already present, skipping`);
    return;
  }

  let created = 0;
  for (let i = existing; i < COUNT; i++) {
    const lineCount = randInt(1, 5);
    const lines = pickMany(drugs, lineCount).map((d) => ({
      drug: d._id,
      quantity: randInt(5, 100),
      unitPrice: randFloat(2, 200),
    }));
    const bill = Number(
      lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0).toFixed(2)
    );

    try {
      await purchaseModel.create({
        purchaseAt: randDate(60),
        drugs: lines,
        bill: Math.max(bill, 0.01),
      });
      created += 1;
    } catch (err) {
      log("purchases", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("purchases", `${created} created`);
}

if (require.main === module) {
  runSeeder("purchases", seedPurchases);
}

module.exports = seedPurchases;
