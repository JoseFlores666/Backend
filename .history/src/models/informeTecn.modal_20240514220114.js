import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const informeTecnSchema = new mongoose.Schema({
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
  suministros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suministro'
  }],
  firmas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firma",
  },
  estado: String
});

export default mongoose.model('InformeTecn', informeTecnSchema);
