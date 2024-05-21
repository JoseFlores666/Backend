import mongoose from 'mongoose';

const informeTecnicSchema = new mongoose.Schema({
  folio:String,
  informe:{
  Solicita:{
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
solicitud:{
  insumosSolicitados:{
    fechaAtencion: String,
    cantidad: Number,
    descripcion: String,
    Observacionestecnicas:String
  }
}
  ,
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

export default mongoose.model('InformeTecnic0', informeTecnicSchema);
