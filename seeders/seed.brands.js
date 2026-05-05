const { log, pick, requireModel, runSeeder } = require("./seed.shared");
const seedGenerics = require("./seed.generics");
const seedManufacturers = require("./seed.manufacturers");

const brandModel = requireModel("brand");
const genericModel = requireModel("generic");
const mfrModel = requireModel("mfr");

const BRAND_PREFIXES = [
  "Acu", "Bio", "Cardi", "Derm", "Endo", "Flex", "Gen", "Hexa",
  "Iso", "Juvi", "Kine", "Luma", "Medi", "Nova", "Opti", "Plex",
  "Quan", "Reno", "Solu", "Tera",
];
const BRAND_SUFFIXES = ["xa", "ron", "vit", "cure", "med", "pharma", "lab", "max", "fast", "plus"];

const BRANDS_PER_GENERIC = 3;

async function seedBrands() {
  if ((await genericModel.countDocuments()) === 0) {
    log("brands", "no generics found, seeding generics first");
    await seedGenerics();
  }
  if ((await mfrModel.countDocuments()) === 0) {
    log("brands", "no manufacturers found, seeding manufacturers first");
    await seedManufacturers();
  }

  const generics = await genericModel.find().lean();
  const mfrs = await mfrModel.find().lean();

  const used = new Set(
    (await brandModel.find({}, { name: 1 }).lean()).map((b) => b.name)
  );

  let created = 0;
  for (const generic of generics) {
    for (let i = 0; i < BRANDS_PER_GENERIC; i++) {
      let name = "";
      for (let attempt = 0; attempt < 6; attempt++) {
        const candidate = `${pick(BRAND_PREFIXES)}${pick(BRAND_SUFFIXES)}-${generic.name.slice(0, 3)}${i + 1}`;
        if (!used.has(candidate)) {
          name = candidate;
          used.add(candidate);
          break;
        }
      }
      if (!name) continue;
      try {
        await brandModel.create({
          name,
          generic: generic._id,
          manufacturer: pick(mfrs)._id,
        });
        created += 1;
      } catch {
        // duplicate keys / races: skip
      }
    }
  }

  log("brands", `${created} created`);
}

if (require.main === module) {
  runSeeder("brands", seedBrands);
}

module.exports = seedBrands;
