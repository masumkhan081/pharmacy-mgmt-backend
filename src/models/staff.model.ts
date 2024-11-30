 
import mongoose  from "mongoose";

export default mongoose.model("staff",new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      minlength: [1, "Full name must be at least 1 character long."],
      maxlength: [100, "Full name must be at most 100 characters long."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      minlength: [10, "Phone number must be at least 10 characters long."],
      maxlength: [15, "Phone number must be at most 15 characters long."],
      validate: {
        validator: function (value: string) {
          return /^(?:\+?[1-9]\d{0,14}|0\d{9,14})$/.test(value);
        },
        message: "Phone number must be a valid format.",
      },
    },
    designation: {
      type: String,
      min: 25,
      max: 200,
      enum: ["admin", "manager", "pharmacist", "salesman"],
      default: "salesman",
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: "Gender must be either MALE, FEMALE, or OTHER.",
      },
    },
    isUser: {
      type: Boolean,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
));





 
