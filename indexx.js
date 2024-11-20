const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const initDB = require("./src/data-tier/mongodb.js");
const { originControl } = require("./src/middleware/middlewares.js");

// initialize the database
initDB();

// middlewares
// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(originControl);
//

// routes
app.use("/auth", require("./src/routes/auth.js"));
app.use("/formulations", require("./src/routes/formulation.js"));
app.use("/units", require("./src/routes/unit.js"));
app.use("/groups", require("./src/routes/group.js"));
app.use("/generics", require("./src/routes/generic.js"));
app.use("/brands", require("./src/routes/brand.js"));
app.use("/manufacturers", require("./src/routes/manufacturer.js"));
app.use("/stock", require("./src/routes/drug.js"));
app.use("/sale", require("./src/routes/sale.js"));
app.use("/purchases", require("./src/routes/purchase.js"));
app.use("/staff", require("./src/routes/staff.js"));
app.use("/salaries", require("./src/routes/salary.js"));

app.listen(3000, () => {
  console.log("running ...");
});
