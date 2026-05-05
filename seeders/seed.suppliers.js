const {
  log,
  pick,
  randInt,
  randomEmail,
  randomFullName,
  randomPhoneBD,
  requireModel,
  runSeeder,
} = require("./seed.shared");
const seedManufacturers = require("./seed.manufacturers");

const mfrModel = requireModel("mfr");
const supplierModel = requireModel("supplier");

const COUNT = 10;
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "On-demand"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

async function seedSuppliers() {
  if ((await mfrModel.countDocuments()) === 0) {
    log("suppliers", "no manufacturers found, seeding manufacturers first");
    await seedManufacturers();
  }

  const mfrs = await mfrModel.find().lean();
  const existing = await supplierModel.countDocuments();
  if (existing >= COUNT) {
    log("suppliers", `${existing} already present, skipping`);
    return;
  }

  let created = 0;
  for (let i = existing; i < COUNT; i++) {
    const fullName = randomFullName();
    try {
      await supplierModel.create({
        fullName,
        phone: randomPhoneBD(),
        altPhone: randomPhoneBD(),
        gender: pick(GENDERS),
        email: randomEmail(fullName),
        manufacturer: pick(mfrs)._id,
        address: `Block ${randInt(1, 30)}, Zone ${randInt(1, 8)}`,
        deliveryFrequency: pick(FREQUENCIES),
        isActive: true,
        notes: "",
      });
      created += 1;
    } catch (err) {
      log("suppliers", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("suppliers", `${created} created`);
}

if (require.main === module) {
  runSeeder("suppliers", seedSuppliers);
}

module.exports = seedSuppliers;
