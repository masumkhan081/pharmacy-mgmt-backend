const { log, pick, randInt, requireModel, runSeeder } = require("./seed.shared");
const seedStaff = require("./seed.staff");

const attendanceModel = requireModel("attendance");
const staffModel = requireModel("staff");

const DAYS_BACK = 14;
const SHIFTS = ["day", "evening", "night"];

async function seedAttendances() {
  if ((await staffModel.countDocuments()) === 0) {
    log("attendances", "no staff found, seeding staff first");
    await seedStaff();
  }

  const staffList = await staffModel.find().lean();
  const today = new Date();

  let created = 0;
  for (const staff of staffList) {
    for (let d = 0; d < DAYS_BACK; d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d);
      if (date.getDay() === 5) continue; // skip Friday

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const exists = await attendanceModel.findOne({
        staff: staff._id,
        date: { $gte: dayStart, $lt: dayEnd },
      });
      if (exists) continue;

      const shift = pick(SHIFTS);
      const startHour = shift === "day" ? 9 : shift === "evening" ? 14 : 21;
      const start = new Date(date);
      start.setHours(startHour, randInt(0, 30), 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + (staff.hoursPerDay || 8));

      try {
        await attendanceModel.create({
          staff: staff._id,
          date,
          shift,
          slots: [{ start, end }],
        });
        created += 1;
      } catch (err) {
        log("attendances", `skipped one (${err && err.message ? err.message : "unknown"})`);
      }
    }
  }

  log("attendances", `${created} created`);
}

if (require.main === module) {
  runSeeder("attendances", seedAttendances);
}

module.exports = seedAttendances;
