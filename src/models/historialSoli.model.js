import mongoose from "mongoose";

const historialSoliSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  numeroDeSolicitud: {
    type: mongoose.Types.ObjectId, 
    ref: "Solicitud",
    required: true,
  },
  folio: { type: String, required: true },
  numeroDeEntrega: { type: String, required: false },
  descripcion: { type: String, required: true },
  accion: { type: String, required: true },
});

export default mongoose.model("HistorialSoli", historialSoliSchema);
