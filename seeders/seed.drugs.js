const {
  log,
  pick,
  randFloat,
  randInt,
  requireModel,
  runSeeder,
} = require("./seed.shared");
const seedBrands = require("./seed.brands");
const seedFormulations = require("./seed.formulations");
const seedUnits = require("./seed.units");

const brandModel = requireModel("brand");
const drugModel = requireModel("drug");
const formulationModel = requireModel("formulation");
const unitModel = requireModel("unit");

async function seedDrugs() {
  if ((await brandModel.countDocuments()) === 0) {
    log("drugs", "no brands found, seeding brands first");
    await seedBrands();
  }
  if ((await formulationModel.countDocuments()) === 0) {
    log("drugs", "no formulations found, seeding formulations first");
    await seedFormulations();
  }
  if ((await unitModel.countDocuments()) === 0) {
    log("drugs", "no units found, seeding units first");
    await seedUnits();
  }

  const brands = await brandModel.find().lean();
  const formulations = await formulationModel.find().lean();
  const units = await unitModel.find().lean();

  const existing = await drugModel.countDocuments();
  if (existing >= brands.length) {
    log("drugs", `${existing} already present, skipping`);
    return;
  }

  let created = 0;
  for (const brand of brands) {
    try {
      await drugModel.create({
        brand: brand._id,
        formulation: pick(formulations)._id,
        unit: pick(units)._id,
        strength: pick([5, 10, 25, 50, 100, 200, 250, 500, 1000]),
        available: randInt(0, 500),
        mrp: randFloat(5, 500),
      });
      created += 1;
    } catch (err) {
      log("drugs", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("drugs", `${created} created`);
}

if (require.main === module) {
  runSeeder("drugs", seedDrugs);
}

module.exports = seedDrugs;
