import mongoose from 'mongoose';
import FolioCounter from './FolioCounter';

const solicitudSchema = new mongoose.Schema({
  folio: String,
  areaSolicitante: {
    type: String,
    required: true,
    enum: ['Administración y Finanzas Mantenimiento y Servicios Generales', 'Otro Departamento'],
    default: 'Administración y Finanzas Mantenimiento y Servicios Generales'
  },
  fecha: Date,
  tipoSuministro: String,
  procesoClave: String,
  suministros: [{
    cantidad: Number,
    unidad: String,
    descripcion: String,
    cantidadEntregada: Number
  }],
  proyecto: String,
  actividades: String,
  justificacionAdquisicion: String,
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
    enum: ['Pendiente', 'Asignada', 'Diagnosticada', 'Atendida', 'Rechazada'],
    default: 'Pendiente'
  }
});

// Middleware para generar el folio automáticamente
solicitudSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await FolioCounter.findOneAndUpdate({}, { $inc: { seq: 1 } }, { new: true, upsert: true });
    this.folio = `SOL-${counter.seq.toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('Solicitud', solicitudSchema);
