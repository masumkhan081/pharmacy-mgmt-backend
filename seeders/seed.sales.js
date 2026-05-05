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
const saleModel = requireModel("sale");

const COUNT = 30;

async function seedSales() {
  if ((await drugModel.countDocuments()) === 0) {
    log("sales", "no drugs found, seeding drugs first");
    await seedDrugs();
  }

  const drugs = await drugModel.find().lean();
  if (!drugs.length) {
    log("sales", "drug pool empty, aborting");
    return;
  }

  const existing = await saleModel.countDocuments();
  if (existing >= COUNT) {
    log("sales", `${existing} already present, skipping`);
    return;
  }

  let created = 0;
  for (let i = existing; i < COUNT; i++) {
    const lineCount = randInt(1, 4);
    const lines = pickMany(drugs, lineCount).map((d) => ({
      drug: d._id,
      quantity: randInt(1, 10),
      mrp: randFloat(5, 500),
    }));
    const bill = Number(
      lines.reduce((sum, l) => sum + l.quantity * l.mrp, 0).toFixed(2)
    );

    try {
      await saleModel.create({
        saleAt: randDate(30),
        drugs: lines,
        bill: Math.max(bill, 0.01),
      });
      created += 1;
    } catch (err) {
      log("sales", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("sales", `${created} created`);
}

if (require.main === module) {
  runSeeder("sales", seedSales);
}

module.exports = seedSales;
