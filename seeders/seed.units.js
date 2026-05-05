const { log, requireModel, runSeeder } = require("./seed.shared");

const unitModel = requireModel("unit");

const UNITS = [
  { shortName: "mg", longName: "Milligram" },
  { shortName: "g", longName: "Gram" },
  { shortName: "mcg", longName: "Microgram" },
  { shortName: "ml", longName: "Milliliter" },
  { shortName: "L", longName: "Liter" },
  { shortName: "IU", longName: "International Unit" },
  { shortName: "%", longName: "Percent" },
  { shortName: "drop", longName: "Drop" },
  { shortName: "puff", longName: "Puff" },
  { shortName: "tab", longName: "Tablet" },
];

async function seedUnits() {
  let created = 0;
  for (const u of UNITS) {
    const r = await unitModel.updateOne(
      { shortName: u.shortName },
      { $setOnInsert: u },
      { upsert: true }
    );
    if (r.upsertedCount) created += 1;
  }
  log("units", `${created} created, ${UNITS.length - created} already present`);
}

if (require.main === module) {
  runSeeder("units", seedUnits);
}

module.exports = seedUnits;
