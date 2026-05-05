const { log, requireModel, runSeeder } = require("./seed.shared");
const seedStaff = require("./seed.staff");

const staffModel = requireModel("staff");
const userModel = requireModel("user");

const DESIGNATION_TO_ROLE = {
  admin: "ADMIN",
  manager: "MANAGER",
  pharmacist: "MANAGER",
  salesman: "SALESMAN",
};

const DEFAULT_PASSWORD = "pass1234";

async function seedUsers() {
  if ((await staffModel.countDocuments()) === 0) {
    log("users", "no staff found, seeding staff first");
    await seedStaff();
  }

  const staffList = await staffModel.find({ isUser: { $ne: true } });

  let created = 0;
  for (const staff of staffList) {
    const username = staff.email.split("@")[0];
    const role = DESIGNATION_TO_ROLE[staff.designation] || "SALESMAN";

    const exists = await userModel.findOne({ username });
    if (exists) continue;

    try {
      const user = await userModel.create({
        username,
        password: DEFAULT_PASSWORD,
        role,
        staff: staff._id,
        isVerified: true,
        isActive: true,
      });

      staff.set("isUser", true);
      staff.set("user", user._id);
      await staff.save();
      created += 1;
    } catch (err) {
      log("users", `skipped one (${err && err.message ? err.message : "unknown"})`);
    }
  }

  log("users", `${created} created (default password: ${DEFAULT_PASSWORD})`);
}

if (require.main === module) {
  runSeeder("users", seedUsers);
}

module.exports = seedUsers;
