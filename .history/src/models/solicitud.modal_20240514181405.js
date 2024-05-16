import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
  folio:{type:String,unique:true},
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
  },
  estado: String

});

const solicitud = mongoose.model('Solicitud', solicitudSchema);

export default