import mongoose from "mongoose";
//
export default mongoose.model(
  "salaries",
  new mongoose.Schema({
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
  })
);
