"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceSchema = exports.attendanceSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Attendance` model via `attendance.service.createAttendance`:
// service maps `data.staff -> staffId`. Fields: staff(uuid), status, date?
exports.attendanceSchema = zod_1.z.object({
    staff: zod_1.z.string().uuid("Invalid staff ID"),
    status: zod_1.z
        .string()
        .min(1, "Status is required")
        .max(20, "Status must be at most 20 characters long"),
    date: zod_1.z.coerce.date().optional(),
});
exports.updateAttendanceSchema = exports.attendanceSchema.partial();
