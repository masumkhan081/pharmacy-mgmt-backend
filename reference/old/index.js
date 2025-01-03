import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import dotenv from "dotenv";
dotenv.config();
import initDB from "./src/config/mongodb.js";
import originControl from "./src/middlewares/corsMiddleware.js";
import config from "./src/config/index.js";
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(originControl);
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
    const unexpectedErrorHandler = (error) => {
        console.log(error);
        exitHandler();
    };
    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);
}
bootstrap();
// routes
import authRoutes from "./src/routes/auth.js";
import formulationRoutes from "./src/routes/formulation.js";
import unitRoutes from "./src/routes/unit.js";
import groupRoutes from "./src/routes/group.js";
import genericRoutes from "./src/routes/generic.js";
import brandRoutes from "./src/routes/brand.js";
import manufacturerRoutes from "./src/routes/manufacturer.js";
import stockRoutes from "./src/routes/drug.js";
import saleRoutes from "./src/routes/sale.js";
import purchaseRoutes from "./src/routes/purchase.js";
import staffRoutes from "./src/routes/staff.js";
import salaryRoutes from "./src/routes/salary.js";
app.use("/auth", authRoutes);
app.use("/formulations", formulationRoutes);
app.use("/units", unitRoutes);
app.use("/groups", groupRoutes);
app.use("/generics", genericRoutes);
app.use("/brands", brandRoutes);
app.use("/manufacturers", manufacturerRoutes);
app.use("/stock", stockRoutes);
app.use("/sale", saleRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/staff", staffRoutes);
app.use("/salaries", salaryRoutes);
export default app;
