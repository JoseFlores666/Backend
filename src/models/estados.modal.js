import mongoose from "mongoose";

const estadosSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, unique: true },
  cantidadTotal: { type: Number, default: 0 },
});

export default mongoose.model("Estados", estadosSchema);
