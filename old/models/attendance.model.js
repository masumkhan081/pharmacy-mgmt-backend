
import mongoose, {Schema}  from "mongoose";
//
export default mongoose.model(
    "attendances",
    Schema({
      staff: {
        type: Schema.Types.ObjectId,
        ref: "staff",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      shift: {
        type: String,
        enum: ["day", "evening", "night", ""],
        default: "day",
        required: true,
      },
      slots: [
        {
          start: { type: Date, required: true },
          end: { type: Date, required: true },
        },
      ],
    })
  );