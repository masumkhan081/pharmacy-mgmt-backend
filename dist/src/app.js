"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
// routes
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const unit_route_1 = __importDefault(require("./routes/unit.route"));
const formulation_route_1 = __importDefault(require("./routes/formulation.route"));
const mfr_route_1 = __importDefault(require("./routes/mfr.route"));
const generic_route_1 = __importDefault(require("./routes/generic.route"));
const group_route_1 = __importDefault(require("./routes/group.route"));
const brand_route_1 = __importDefault(require("./routes/brand.route"));
const drug_route_1 = __importDefault(require("./routes/drug.route"));
const staff_route_1 = __importDefault(require("./routes/staff.route"));
const salary_route_1 = __importDefault(require("./routes/salary.route"));
const purchase_route_1 = __importDefault(require("./routes/purchase.route"));
const sale_route_1 = __importDefault(require("./routes/sale.route"));
const attendance_route_1 = __importDefault(require("./routes/attendance.route"));
//
// middlewares
app.use(express_1.default.json());
app.use(corsMiddleware_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/public", express_1.default.static("public"));
//
app.get("/", (req, res) => {
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "I am functional !",
        data: null,
    });
});
//
app.use("/api/auth", auth_route_1.default);
app.use("/api/units", unit_route_1.default);
app.use("/api/formulations", formulation_route_1.default);
app.use("/api/manufacturers", mfr_route_1.default);
app.use("/api/generics", generic_route_1.default);
app.use("/api/groups", group_route_1.default);
app.use("/api/brands", brand_route_1.default);
app.use("/api/drugs", drug_route_1.default);
app.use("/api/staff", staff_route_1.default);
app.use("/api/salaries", salary_route_1.default);
app.use("/api/purchases", purchase_route_1.default);
app.use("/api/sales", sale_route_1.default);
app.use("/api/attendances", attendance_route_1.default);
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
exports.default = app;
