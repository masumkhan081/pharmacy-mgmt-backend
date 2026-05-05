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

const staffModel = requireModel("staff");

const COUNT = 12;
const DESIGNATIONS = ["admin", "manager", "pharmacist", "salesman"];
const SHIFTS = ["Morning", "Afternoon", "Night"];
const SALARY_TYPES = ["Hourly", "Weekly", "Monthly"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

async function seedStaff() {
  const existing = await staffModel.countDocuments();
  if (existing >= COUNT) {
    log("staff", `${existing} already present, skipping`);
    return;
  }

  let created = 0;
  for (let i = existing; i < COUNT; i++) {
    const fullName = randomFullName();
    const designation = i === 0 ? "admin" : pick(DESIGNATIONS);
    const salaryType = pick(SALARY_TYPES);
    const salaryFields = {};
    if (salaryType === "Hourly") salaryFields.hourlySalary = randInt(150, 500);
    if (salaryType === "Weekly") salaryFields.weeklySalary = randInt(3000, 9000);
    if (salaryType === "Monthly") salaryFields.monthlySalary = randInt(15000, 60000);

    try {
      await staffModel.create({
        fullName,
        phone: randomPhoneBD(),
        altPhone: randomPhoneBD(),
        gender: pick(GENDERS),
        email: randomEmail(fullName),
        designation,
        address: `Plot ${randInt(1, 250)}, Sector ${randInt(1, 12)}`,
        shift: pick(SHIFTS),
        salaryType,
        ...salaryFields,
        hoursPerDay: randInt(6, 10),
        daysPerWeek: randInt(5, 7),
        isUser: false,
      });
      created += 1;
    } catch (err) {
      log("staff", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("staff", `${created} created`);
}

if (require.main === module) {
  runSeeder("staff", seedStaff);
}

module.exports = seedStaff;
