import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();
import dotenv from "dotenv";
dotenv.config();
import originControl from "./middlewares/corsMiddleware";
import { sendErrorResponse } from "./utils/responseHandler";
// routes
import authRoutes from "./routes/auth.route";
import unitRoutes from "./routes/unit.route";
import formulationRoutes from "./routes/formulation.route";
import mfrRoutes from "./routes/mfr.route";
import genericRoutes from "./routes/generic.route";
import groupRoutes from "./routes/group.route";
import brandRoutes from "./routes/brand.route";
import drugRoutes from "./routes/drug.route";
import staffRoutes from "./routes/staff.route";
import salaryRoutes from "./routes/salary.route";
import purchaseRoutes from "./routes/purchase.route";
import saleRoutes from "./routes/sale.route";
import attendanceRoutes from "./routes/attendance.route";
import supplierRoutes from "./routes/supplier.route";
import customerRoutes from "./routes/customer.route";
import doctorRoutes from "./routes/doctor.route";
import prescriptionRoutes from "./routes/prescription.route";
import inventoryAlertRoutes from "./routes/inventoryAlert.route";
import inventoryBatchRoutes from "./routes/inventoryBatch.route";
import invoiceRoutes from "./routes/invoice.route";
import notificationRoutes from "./routes/notification.route";
import paymentRoutes from "./routes/payment.route";
import returnRoutes from "./routes/return.route";
import unitModel from "./models/unit.model";
// 
// middlewares
app.use(originControl);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
//
app.get("/", async (req: Request, res: Response) => {

  const data = await unitModel.find({});

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: `I am functional ${req.headers.origin}`,
    data,
  });
});
//
app.use("/api/auth", authRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/formulations", formulationRoutes);
app.use("/api/manufacturers", mfrRoutes);
app.use("/api/generics", genericRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/inventory-alerts", inventoryAlertRoutes);
app.use("/api/inventory-batches", inventoryBatchRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/returns", returnRoutes);
//
app.use((req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: "API Not Found",
    errors: [{ field: "path", message: req.originalUrl }],
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  sendErrorResponse({ res, error: err });
});

export default app;
