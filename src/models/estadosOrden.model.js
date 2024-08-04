import mongoose from "mongoose";

const ordenTrabajoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, unique: true },
  cantidadTotal: { type: Number, default: 0 },
});

export default mongoose.model("OrdenTrabajoEstados", ordenTrabajoSchema);
