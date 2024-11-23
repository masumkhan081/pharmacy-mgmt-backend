import mongoose, {Schema}  from "mongoose";
//
export default mongoose.model(
  "purchases",
  new Schema({
    purchaseAt: {
      type: Date,
      required: true,
    },
    drugs: [
      {
        drug: {
          type: Schema.Types.ObjectId,
          ref: "drugs",
        },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    bill: {
      type: Number,
      required: true,
    },
  })
);
