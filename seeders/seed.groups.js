const { log, requireModel, runSeeder } = require("./seed.shared");

const groupModel = requireModel("group");

const GROUPS = [
  "Antibiotic",
  "Analgesic",
  "Antipyretic",
  "Antihistamine",
  "Antiviral",
  "Antifungal",
  "Antacid",
  "Antidepressant",
  "Antihypertensive",
  "Antidiabetic",
  "Bronchodilator",
  "Corticosteroid",
  "Diuretic",
  "Vitamin",
  "NSAID",
];

async function seedGroups() {
  let created = 0;
  for (const name of GROUPS) {
    const r = await groupModel.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
    if (r.upsertedCount) created += 1;
  }
  log(
    "groups",
    `${created} created, ${GROUPS.length - created} already present`
  );
}

if (require.main === module) {
  runSeeder("groups", seedGroups);
}

module.exports = seedGroups;
