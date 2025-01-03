import mongoose, { Schema } from "mongoose";
// Create the manufacturer schema
const ManufacturerSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
});
// Export the manufacturer model
const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);
export default Manufacturer;
