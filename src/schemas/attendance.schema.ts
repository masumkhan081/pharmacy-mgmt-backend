import { z } from "zod";

// Aligned to Prisma `Attendance` model via `attendance.service.createAttendance`:
// service maps `data.staff -> staffId`. Fields: staff(uuid), status, date?
export const attendanceSchema = z.object({
  staff: z.string().uuid("Invalid staff ID"),
  status: z
    .string()
    .min(1, "Status is required")
    .max(20, "Status must be at most 20 characters long"),
  date: z.coerce.date().optional(),
});

export const updateAttendanceSchema = attendanceSchema.partial();
