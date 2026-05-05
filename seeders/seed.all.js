const { log, runSeeder } = require("./seed.shared");

const PIPELINE = [
  ["units", require("./seed.units")],
  ["formulations", require("./seed.formulations")],
  ["groups", require("./seed.groups")],
  ["manufacturers", require("./seed.manufacturers")],
  ["generics", require("./seed.generics")],
  ["brands", require("./seed.brands")],
  ["drugs", require("./seed.drugs")],
  ["staff", require("./seed.staff")],
  ["users", require("./seed.users")],
  ["suppliers", require("./seed.suppliers")],
  ["purchases", require("./seed.purchases")],
  ["sales", require("./seed.sales")],
  ["salaries", require("./seed.salaries")],
  ["attendances", require("./seed.attendances")],
];

async function seedAll() {
  for (const [label, fn] of PIPELINE) {
    try {
      log("all", `running ${label}`);
      await fn();
    } catch (err) {
      log("all", `${label} failed: ${err && err.message ? err.message : String(err)}`);
    }
  }
}

if (require.main === module) {
  runSeeder("all", seedAll);
}

module.exports = seedAll;
