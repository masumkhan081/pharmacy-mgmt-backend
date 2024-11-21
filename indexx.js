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
//
const cookieParser = require("cookie-parser"); 
const cors = require("cors");
const express = require("express"); 
const httpStatus = require("http-status"); 

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
//
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
//
app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "I am functional !",
    data: null,
  });
});
 

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});
// 
async function bootstrap() {
  const server = app.listen(config.port, async () => {
    console.log(`Server running on port ${config.port}`);
    await mongodbConnection();
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}

bootstrap();

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



module.exports = app;
