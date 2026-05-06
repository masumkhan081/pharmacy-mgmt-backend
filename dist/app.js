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
const responseHandler_1 = require("./utils/responseHandler");
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
const supplier_route_1 = __importDefault(require("./routes/supplier.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const doctor_route_1 = __importDefault(require("./routes/doctor.route"));
const prescription_route_1 = __importDefault(require("./routes/prescription.route"));
const inventoryAlert_route_1 = __importDefault(require("./routes/inventoryAlert.route"));
const inventoryBatch_route_1 = __importDefault(require("./routes/inventoryBatch.route"));
const invoice_route_1 = __importDefault(require("./routes/invoice.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const return_route_1 = __importDefault(require("./routes/return.route"));
const unit_model_1 = __importDefault(require("./models/unit.model"));
// 
// middlewares
app.use(corsMiddleware_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/public", express_1.default.static("public"));
//
app.get("/", async (req, res) => {
    const data = await unit_model_1.default.find({});
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: `I am functional ${req.headers.origin}`,
        data,
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
app.use("/api/suppliers", supplier_route_1.default);
app.use("/api/customers", customer_route_1.default);
app.use("/api/doctors", doctor_route_1.default);
app.use("/api/prescriptions", prescription_route_1.default);
app.use("/api/inventory-alerts", inventoryAlert_route_1.default);
app.use("/api/inventory-batches", inventoryBatch_route_1.default);
app.use("/api/invoices", invoice_route_1.default);
app.use("/api/notifications", notification_route_1.default);
app.use("/api/payments", payment_route_1.default);
app.use("/api/returns", return_route_1.default);
//
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        success: false,
        message: "API Not Found",
        errors: [{ field: "path", message: req.originalUrl }],
    });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    (0, responseHandler_1.sendErrorResponse)({ res, error: err });
});
exports.default = app;
