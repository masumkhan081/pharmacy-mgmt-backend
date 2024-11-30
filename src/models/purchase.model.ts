import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "purchases",
  new Schema(
    {
      purchaseAt: {
        type: Date,
        required: [true, "Purchase date is required"],
      },
      drugs: [
        {
          drug: {
            type: Schema.Types.ObjectId,
            ref: "drugs",
            required: [true, "Drug reference is required"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"],
          },
          unitPrice: {
            type: Number,
            required: [true, "Unit price is required"],
            min: [0.01, "Unit price must be at least 0.01"],
          },
        },
      ],
      bill: {
        type: Number,
        required: [true, "Total bill amount is required"],
        min: [0.01, "Bill amount must be at least 0.01"],
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
);
