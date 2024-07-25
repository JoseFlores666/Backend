import mongoose from "mongoose";

const tecnicoSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true ,},
  edad: { type: String, required: true ,},
  telefono: { type: Number, required: true ,},
  correo: { type: String, required: true ,},
  area: { type: String, required: true ,},
});

export default mongoose.model("Tecnicos", tecnicoSchema);
