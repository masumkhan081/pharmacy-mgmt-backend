const { log, requireModel, runSeeder } = require("./seed.shared");

const formulationModel = requireModel("formulation");

const FORMULATIONS = [
  { shortName: "Tab", longName: "Tablet" },
  { shortName: "Cap", longName: "Capsule" },
  { shortName: "Syp", longName: "Syrup" },
  { shortName: "Inj", longName: "Injection" },
  { shortName: "Crm", longName: "Cream" },
  { shortName: "Oint", longName: "Ointment" },
  { shortName: "Susp", longName: "Suspension" },
  { shortName: "Drp", longName: "Drops" },
  { shortName: "Inh", longName: "Inhaler" },
  { shortName: "Sup", longName: "Suppository" },
];

async function seedFormulations() {
  let created = 0;
  for (const f of FORMULATIONS) {
    const r = await formulationModel.updateOne(
      { shortName: f.shortName },
      { $setOnInsert: f },
      { upsert: true }
    );
    if (r.upsertedCount) created += 1;
  }
  log(
    "formulations",
    `${created} created, ${FORMULATIONS.length - created} already present`
  );
}

if (require.main === module) {
  runSeeder("formulations", seedFormulations);
}

module.exports = seedFormulations;
