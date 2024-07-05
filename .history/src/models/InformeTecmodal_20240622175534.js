import mongoose from "mongoose";

const informeTecnicSchema = new mongoose.Schema({
  folio: String,
  informe: {
    Solicita: {
      nombre: String,
      areaSolicitante: String,
      edificio: String,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    tipoDeMantenimiento: String,
    tipoDeTrabajo: String,
    tipoDeSolicitud: String,
    descripcionDelServicio: String,
  },
  solicitud: {
    insumosSolicitados: {
      fechaAtencion: String,
      cantidad: Number,
      descripcion: String,
      Observacionestecnicas: String,
      img:string
    },
  },
  firmas: {
    type: mongoose.Types.ObjectId,
    ref: "Firmas",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  estado: {
    type: String,
    required: true,
    enum: ["Pendiente", "Asignada", "Diagnosticada", "Atendida", "Rechaza"],
    default: "Pendiente",
  },
});

export default mongoose.model("InformeTecnico", informeTecnicSchema);
