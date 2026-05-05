const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

const distExists = (() => {
  try {
    require.resolve(path.resolve(__dirname, "../dist/config/mongodb.js"));
    return true;
  } catch {
    return false;
  }
})();

if (!distExists) {
  console.error(
    "[seed] dist/ not found. Run `npm run build` (or keep `npm run dev` running) before seeding."
  );
  process.exit(1);
}

const mongodbConnection = require("../dist/config/mongodb").default;

const connect = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongodbConnection();
};

const disconnect = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.connection.close();
};

const log = (label, message) => {
  console.log(`[seed:${label}] ${message}`);
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pickMany = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
};

const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randFloat = (min, max, decimals = 2) => {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
};

const randDate = (daysBack = 30) => {
  const now = Date.now();
  return new Date(now - randInt(0, daysBack) * 24 * 60 * 60 * 1000);
};

const FIRST_NAMES = [
  "Aarav", "Bilal", "Chandni", "Dilip", "Ehsan", "Farhana", "Gopal",
  "Hena", "Imran", "Jasmin", "Kabir", "Laila", "Mehedi", "Nadia",
  "Omar", "Priya", "Qasim", "Reza", "Sania", "Tarek", "Uma", "Vivek",
];
const LAST_NAMES = [
  "Khan", "Hossain", "Ahmed", "Roy", "Das", "Rahman", "Begum",
  "Sarker", "Mondol", "Chowdhury", "Mia", "Akter", "Islam", "Karim",
];

const randomFullName = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

const randomEmail = (seed) => {
  const slug = String(seed).toLowerCase().replace(/[^a-z]/g, "").slice(0, 12);
  return `${slug}.${randInt(100, 999)}@pharma.test`;
};

const randomPhoneBD = () => {
  const carriers = ["13", "14", "15", "16", "17", "18", "19"];
  return `01${pick(carriers)}${randInt(10000000, 99999999)}`;
};

const requireModel = (name) => require(`../dist/models/${name}.model`).default;

const runSeeder = async (label, fn) => {
  const start = Date.now();
  try {
    await connect();
    log(label, "starting");
    await fn();
    log(label, `done in ${Date.now() - start}ms`);
  } catch (err) {
    log(label, `failed: ${err && err.message ? err.message : String(err)}`);
    process.exitCode = 1;
  } finally {
    await disconnect();
  }
};

module.exports = {
  connect,
  disconnect,
  log,
  pick,
  pickMany,
  randInt,
  randFloat,
  randDate,
  randomFullName,
  randomEmail,
  randomPhoneBD,
  requireModel,
  runSeeder,
};
