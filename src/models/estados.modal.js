import mongoose from "mongoose";

const estadosSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, unique: true }
});

export default mongoose.model("Estados", estadosSchema);
