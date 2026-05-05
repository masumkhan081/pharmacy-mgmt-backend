const { log, requireModel, runSeeder } = require("./seed.shared");

const mfrModel = requireModel("mfr");

const MANUFACTURERS = [
  "Square Pharma",
  "Beximco Pharma",
  "Incepta Pharma",
  "Renata Limited",
  "ACI Limited",
  "Eskayef Pharma",
  "Opsonin Pharma",
  "Aristopharma",
  "Drug International",
  "Healthcare Pharma",
  "Popular Pharma",
  "Acme Laboratories",
];

async function seedManufacturers() {
  let created = 0;
  for (const name of MANUFACTURERS) {
    const r = await mfrModel.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
    if (r.upsertedCount) created += 1;
  }
  log(
    "manufacturers",
    `${created} created, ${MANUFACTURERS.length - created} already present`
  );
}

if (require.main === module) {
  runSeeder("manufacturers", seedManufacturers);
}

module.exports = seedManufacturers;
