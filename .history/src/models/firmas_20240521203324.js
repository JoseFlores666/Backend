const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmaSchema = new Schema({
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

const Solicitud = mongoose.model('Solicitud', solicitudSchema);

module.exports = Solicitud;
