import mongoose from "mongoose";

const tecnicoSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  edad: { type: Number, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  activo: { type: Boolean, default: true },
});

export default mongoose.model("Tecnicos", tecnicoSchema);
