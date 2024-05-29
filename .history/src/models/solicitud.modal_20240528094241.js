import mongoose from 'mongoose';
import FolioCounter from './folioCounter.modal.js';

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
    ref: 'Firmas',
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  estado: {
    type: String,
    required: true,
    enum: ['Pendiente', 'Asignada', 'Diagnosticada', 'Atendida', 'Rechazada'],
    default: 'Pendiente'
  }
});

// Middleware para generar folio automáticamente
solicitudSchema.pre('save', async function(next) {
  if (!this.folio) {
    const folioCounter = await FolioCounter.findOneAndUpdate({}, { $inc: { counter: 1 } }, { new: true, upsert: true });
    this.folio = `SOL-${folioCounter.counter.toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('Solicitud', solicitudSchema);
