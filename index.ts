import express, { Express, Request, Response } from "express";
const app: Express = express();

import dotenv from "dotenv";
dotenv.config();
import initDB from "./src/config/mongodb";
import originControl from "./src/middlewares/corsMiddleware";
import config from "./src/config";
// routes
import unitRoutes from "./src/routes/unit.route";
// import formulationRoutes from "./src/routes/formulation";
// import mfrRoutes from "./src/routes/mfr";
// import genericRoutes from "./src/routes/generic";
// import groupRoutes from "./src/routes/group";
// import brandRoutes from "./src/routes/brand";
// import drugRoutes from "./src/routes/drug";
// import staffRoutes from "./src/routes/staff";
// import salaryRoutes from "./src/routes/salary";
// import purchaseRoutes from "./src/routes/purchase";
// import saleRoutes from "./src/routes/sale";

//

// middlewares
app.use(express.json());
app.use(originControl);
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
//
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "I am functional !",
    data: null,
  });
});
//
app.use((req, res, next) => {
  res.status(404).json({
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

app.use("/api/units", unitRoutes);
// app.use("/api/formulations", formulationRoutes);
// app.use("/api/mfrs", mfrRoutes);
// app.use("/api/generics", genericRoutes);
// app.use("/api/groups", groupRoutes);
// app.use("/api/brands", brandRoutes);
// app.use("/api/drugs", drugRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/salaries", salaryRoutes);
// app.use("/api/purchases", purchaseRoutes);
// app.use("/api/sales", saleRoutes);

//
async function bootstrap() {
  const server = app.listen(config.port, async () => {
    console.log(`Server running on port ${config.port}`);
    // initialize the database
    initDB();
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
    }
    process.exit(1);
  };
  const unexpectedErrorHandler = (error: Error) => {
    console.log(error);
    exitHandler();
  };
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}
bootstrap();
