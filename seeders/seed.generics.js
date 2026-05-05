const { log, pick, requireModel, runSeeder } = require("./seed.shared");
const seedGroups = require("./seed.groups");

const genericModel = requireModel("generic");
const groupModel = requireModel("group");

const GENERICS_BY_GROUP = {
  Antibiotic: ["Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline", "Cefixime"],
  Analgesic: ["Paracetamol", "Tramadol", "Diclofenac"],
  Antipyretic: ["Ibuprofen", "Aspirin"],
  Antihistamine: ["Cetirizine", "Loratadine", "Fexofenadine"],
  Antiviral: ["Acyclovir", "Oseltamivir"],
  Antifungal: ["Fluconazole", "Itraconazole"],
  Antacid: ["Omeprazole", "Esomeprazole", "Ranitidine", "Pantoprazole"],
  Antidepressant: ["Sertraline", "Fluoxetine"],
  Antihypertensive: ["Amlodipine", "Losartan", "Atenolol"],
  Antidiabetic: ["Metformin", "Glimepiride"],
  Bronchodilator: ["Salbutamol", "Montelukast"],
  Corticosteroid: ["Prednisolone", "Dexamethasone"],
  Diuretic: ["Furosemide", "Spironolactone"],
  Vitamin: ["Cholecalciferol", "Cyanocobalamin", "Folic Acid"],
  NSAID: ["Naproxen", "Ketorolac"],
};

async function seedGenerics() {
  if ((await groupModel.countDocuments()) === 0) {
    log("generics", "no groups found, seeding groups first");
    await seedGroups();
  }

  const groups = await groupModel.find().lean();
  const groupByName = new Map(groups.map((g) => [g.name, g._id]));

  let created = 0;
  for (const [groupName, names] of Object.entries(GENERICS_BY_GROUP)) {
    const groupId = groupByName.get(groupName);
    if (!groupId) continue;
    for (const name of names) {
      const r = await genericModel.updateOne(
        { name },
        { $setOnInsert: { name, group: groupId } },
        { upsert: true }
      );
      if (r.upsertedCount) created += 1;
    }
  }

  const orphans = await genericModel.find({ group: { $exists: false } });
  for (const o of orphans) {
    o.set("group", pick(groups)._id);
    await o.save();
  }

  log("generics", `${created} created`);
}

if (require.main === module) {
  runSeeder("generics", seedGenerics);
}

module.exports = seedGenerics;
