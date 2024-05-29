const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmasSchema = new Schema({
  nombre: String,
  firma: String,
  fecha: Date
});

const solicitudSchema = new Schema({
  solicitudId: { type: String, required: true },
  solicitante: {
    nombre: { type: String, required: true },
    departamento: { type: String, required: true },
    fecha: { type: Date, required: true }
  },
  revision: {
    jefeInmediato: firmaSchema
  },
  validacion: {
    direccionAdminFinanzas: firmaSchema
  },
  autorizacion: {
    rectoria: firmaSchema
  }
});

export default mongoose.model('firmas', firmasSchema);


