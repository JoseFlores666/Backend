import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const solicitudSchema = new mongoose.Schema({
  folio: {
    type: String,
    default: uuidv4,
    unique: true
  },
  informe: {
    Solicita: {
      nombre: String,
      areaSolicitante: String,
      edificio: String,
    },
    fecha: {
      type: Date, 
      default: Date.now 
    },
    tipoDeMantenimiento: String,
    tipoDeTrabajo: String,
    tipoDeSolicitud: String,
    descripcionDelServicio: String,
  },
  solicitud: {
    insumosSolicitados: {
      cantidad: Number,
      descripcion: String,
      Observacionestecnicas: String
    }
  },
  firmas: {
    solicitud: String,
    revision: String,
    validacion: String,
    autorizacion: String
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  estado: String
});

export default mongoose.model('Solicitud', solicitudSchema);
