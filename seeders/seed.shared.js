// Prisma-backed seeding helpers to replace legacy Mongoose usage.
// This file intentionally preserves the public API used by existing
// seeder modules (countDocuments, find().lean(), create, updateOne,
// set/save) while delegating to Prisma Client.

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const log = (label, message) => console.log(`[seed:${label}] ${message}`);
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
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 2) => Number((Math.random() * (max - min) + min).toFixed(decimals));
const randDate = (daysBack = 30) => new Date(Date.now() - randInt(0, daysBack) * 24 * 60 * 60 * 1000);
const randomFullName = () => {
  const FIRST_NAMES = [
    "Aarav", "Bilal", "Chandni", "Dilip", "Ehsan", "Farhana", "Gopal",
    "Hena", "Imran", "Jasmin", "Kabir", "Laila", "Mehedi", "Nadia",
    "Omar", "Priya", "Qasim", "Reza", "Sania", "Tarek", "Uma", "Vivek",
  ];
  const LAST_NAMES = [
    "Khan", "Hossain", "Ahmed", "Roy", "Das", "Rahman", "Begum",
    "Sarker", "Mondol", "Chowdhury", "Mia", "Akter", "Islam", "Karim",
  ];
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
};
const randomEmail = (seed) => {
  const slug = String(seed).toLowerCase().replace(/[^a-z]/g, "").slice(0, 12);
  return `${slug}.${randInt(100, 999)}@pharma.test`;
};
const randomPhoneBD = () => {
  const carriers = ["13", "14", "15", "16", "17", "18", "19"];
  return `01${pick(carriers)}${randInt(10000000, 99999999)}`;
};

// Map legacy seeder model names -> Prisma model property names
const MODEL_MAP = {
  brand: "brand",
  generic: "generic",
  mfr: "manufacturer",
  manufacturer: "manufacturer",
  group: "group",
  unit: "unit",
  formulation: "formulation",
  drug: "drug",
  purchase: "purchase",
  sale: "sale",
  supplier: "supplier",
  staff: "staff",
  user: "user",
  attendance: "attendance",
  salary: "salary",
  invoice: "invoice",
  inventoryBatch: "inventoryBatch",
};

const FIELD_MAP = {
  generic: "genericId",
  brand: "brandId",
  formulation: "formulationId",
  unit: "unitId",
  manufacturer: "mfrId",
  mfr: "mfrId",
  supplier: "supplierId",
  customer: "customerId",
  purchase: "purchaseId",
  sale: "saleId",
  group: "groupId",
};

const mapKey = (k) => FIELD_MAP[k] || k;

const convertFilter = (filter) => {
  if (!filter || Object.keys(filter).length === 0) return {};
  const where = {};
  for (const [k, v] of Object.entries(filter)) {
    const key = mapKey(k);
    if (v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
      // Map common Mongo-style operators to Prisma where-clause operators
      const prismaOp = {};
      if (v.$ne !== undefined) prismaOp.not = v.$ne;
      if (v.$gte !== undefined) prismaOp.gte = v.$gte;
      if (v.$lte !== undefined) prismaOp.lte = v.$lte;
      if (v.$gt !== undefined) prismaOp.gt = v.$gt;
      if (v.$lt !== undefined) prismaOp.lt = v.$lt;
      if (v.$in !== undefined) prismaOp.in = v.$in;
      if (v.$nin !== undefined) prismaOp.not = { in: v.$nin };
      if (v.$exists !== undefined) {
        if (v.$exists === false) {
          where[key] = null;
          continue;
        } else {
          prismaOp.not = null;
        }
      }

      // If no recognized operators, fall back to raw object (Prisma may accept some shapes)
      where[key] = Object.keys(prismaOp).length ? prismaOp : v;
    } else {
      where[key] = v;
    }
  }
  return where;
};

const convertProjection = (proj) => {
  if (!proj) return undefined;
  const select = {};
  for (const [k, v] of Object.entries(proj)) {
    if (v) select[mapKey(k)] = true;
  }
  return Object.keys(select).length ? select : undefined;
};

const mapCreateData = (data) => {
  const out = {};
  for (const [k, v] of Object.entries(data || {})) {
    const key = mapKey(k);
    out[key] = v;
  }
  return out;
};

const requireModel = (name) => {
  const modelName = MODEL_MAP[name];
  if (!modelName) throw new Error(`Unknown model mapping for '${name}'`);
  const model = prisma[modelName];
  if (!model) throw new Error(`Prisma model not found: ${modelName}`);

  return {
    countDocuments: async (filter) => {
      const where = convertFilter(filter || {});
      return await model.count({ where });
    },
    find: (filter = {}, projection) => {
      const where = convertFilter(filter || {});
      const select = convertProjection(projection);
      const promise = model
        .findMany(select ? { where, select } : { where })
        .then((rows) =>
          rows.map((r) => {
            const doc = { ...r, _id: r.id };
            const pending = {};
            doc.set = (k, v) => {
              pending[k] = v;
              return doc;
            };
            doc.save = async () => {
              const data = mapCreateData(pending);
              await model.update({ where: { id: r.id }, data });
              return { ...doc, ...pending };
            };
            return doc;
          })
        );
      promise.lean = async () => await promise;
      return promise;
    },
    findOne: async (filter = {}, projection) => {
      const where = convertFilter(filter || {});
      const select = convertProjection(projection);
      const r = await model.findFirst(select ? { where, select } : { where });
      if (!r) return null;
      const doc = { ...r, _id: r.id };
      const pending = {};
      doc.set = (k, v) => {
        pending[k] = v;
        return doc;
      };
      doc.save = async () => {
        const data = mapCreateData(pending);
        await model.update({ where: { id: r.id }, data });
        return { ...doc, ...pending };
      };
      return doc;
    },
    create: async (data) => {
      const mapped = mapCreateData(data);
      const created = await model.create({ data: mapped });
      return { ...created, _id: created.id };
    },
    // Minimal updateOne supporting upsert with $setOnInsert
    updateOne: async (filter, update, options = {}) => {
      if (options.upsert) {
        // assume unique key is the first key in filter (commonly `name`)
        const key = Object.keys(filter)[0];
        const val = filter[key];
        const createData = mapCreateData((update && update.$setOnInsert) || {});
        try {
          const up = await model.upsert({
            where: { [mapKey(key)]: val },
            update: {},
            create: createData,
          });
          // emulate Mongoose upsert result object shape
          return { upsertedCount: up ? 1 : 0 };
        } catch (err) {
          return { upsertedCount: 0 };
        }
      }
      // fallback: updateMany
      const where = convertFilter(filter || {});
      const data = mapCreateData(update || {});
      const res = await model.updateMany({ where, data });
      return res;
    },
    // Provide a simple wrapper to return a document-like object with set/save
    // for calls like: const orphans = await genericModel.find({ group: { $exists: false } }); for (const o of orphans) { o.set('group', pick(groups)._id); await o.save(); }
    _docHelpers: {
      attachMethods: (row) => {
        const pending = {};
        row.set = (k, v) => {
          pending[k] = v;
          return row;
        };
        row.save = async () => {
          const data = mapCreateData(pending);
          await model.update({ where: { id: row.id }, data });
          return { ...row, ...pending };
        };
        return row;
      },
    },
    // convenience: findOne by id
    findById: async (id) => {
      const r = await model.findUnique({ where: { id } });
      if (!r) return null;
      return { ...r, _id: r.id };
    },
  };
};

const runSeeder = async (label, fn) => {
  const start = Date.now();
  try {
    log(label, "starting");
    await fn();
    log(label, `done in ${Date.now() - start}ms`);
  } catch (err) {
    log(label, `failed: ${err && err.message ? err.message : String(err)}`);
    process.exitCode = 1;
  }
};

module.exports = {
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
