const { log, randInt, requireModel, runSeeder } = require("./seed.shared");
const seedStaff = require("./seed.staff");

const salaryModel = requireModel("salary");
const staffModel = requireModel("staff");

const MONTHS_BACK = 3;

async function seedSalaries() {
  if ((await staffModel.countDocuments()) === 0) {
    log("salaries", "no staff found, seeding staff first");
    await seedStaff();
  }

  const staffList = await staffModel.find().lean();
  const today = new Date();

  let created = 0;
  for (const staff of staffList) {
    for (let m = 1; m <= MONTHS_BACK; m++) {
      const ref = new Date(today.getFullYear(), today.getMonth() - m, 1);
      const month = ref.getMonth() + 1;
      const year = ref.getFullYear();

      const exists = await salaryModel.findOne({
        staff: staff._id,
        month,
        year,
      });
      if (exists) continue;

      const due =
        staff.salaryType === "Hourly"
          ? (staff.hourlySalary || 0) * (staff.hoursPerDay || 8) * 26
          : staff.salaryType === "Weekly"
            ? (staff.weeklySalary || 0) * 4
            : (staff.monthlySalary || 0);

      const paid = Math.round(due * (randInt(70, 100) / 100));

      try {
        await salaryModel.create({
          staff: staff._id,
          month,
          year,
          dueAmount: due,
          paidAmount: paid,
        });
        created += 1;
      } catch (err) {
        log("salaries", `skipped one (${err && err.message ? err.message : "unknown"})`);
      }
    }
  }

  log("salaries", `${created} created`);
}

if (require.main === module) {
  runSeeder("salaries", seedSalaries);
}

module.exports = seedSalaries;
