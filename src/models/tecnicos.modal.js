import mongoose from "mongoose";

const tecnicoSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  edad: { type: Number, required: true }, // Cambié el tipo a Number
  telefono: { type: String, required: true }, // Cambié el tipo a String para evitar problemas con números largos
  correo: { type: String, required: true },
  area: { type: String, required: true },
});

export default mongoose.model("Tecnicos", tecnicoSchema);
