import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the manufacturer
interface IManufacturer extends Document {
  name: string;
}

// Create the manufacturer schema
const ManufacturerSchema: Schema<IManufacturer> = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

// Export the manufacturer model
const Manufacturer: Model<IManufacturer> =
  mongoose.model < IManufacturer > ("Manufacturer", ManufacturerSchema);
export default Manufacturer;
