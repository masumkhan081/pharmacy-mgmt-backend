import mongoose, {Schema}  from "mongoose";
//
export default mongoose.model(
  "sales",
  new Schema({
    saleAt: {
      type: Date,
      required: true,
    },
    drugs: [
      {
        drug: {
          type: Schema.Types.ObjectId,
          ref: "drugs",
          required: true,
        },
        quantity: { type: Number, required: true },
        mrp: { type: Number, required: true },
      },
    ],
    bill: {
      type: Number,
      required: true,
    },
  })
);
