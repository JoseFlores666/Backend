import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
  folio:String,
  areaSolicitante: 'Administración y Finanzas
  Mantenimiento y Servicios Generales',
  fecha: Date, 
  tipoSuministro: String,
  procesoClave: String,
  suministros: [{
    cantidad: Number,
    unidadMedida: String,
    descripcion: String,
    cantidadEntregada: Number
  }],
    proyecto: String,
    actividades:String,
    justificacionAdquisicion: String,
    firmas: {
    solicitud: String,
    revision: String,
    validacion: String,
    autorizacion: String
    },user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  estado: String
});

export default mongoose.model('Solicitud', solicitudSchema);