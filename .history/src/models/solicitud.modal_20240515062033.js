import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
 
  folio
  areaSolicitante: String,
  fecha: {
    type: Date, 
    default: Date.now 
  },
  tipoSuministro: String,
  procesoClave: String,
  area: String,
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
  
  },
  estado: String
});

export default mongoose.model('Solicitud', solicitudSchema);