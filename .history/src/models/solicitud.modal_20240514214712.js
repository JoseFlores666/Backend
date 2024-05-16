import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema({
  folio: { type: String, unique: true },
  areaSolicitante: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
  tipoSuministro: String,
  procesoClave: String,
  area: String,
  suministros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suministro'
  }],
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
  },
  actividades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actividad",
    },
  ],
  justificacionAdquisicion: String,
  firmas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firma",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  estado: String,
});

export default mongoose.model("Solicitud", solicitudSchema);
