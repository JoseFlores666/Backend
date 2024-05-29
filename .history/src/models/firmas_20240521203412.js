const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmasSchema = new Schema({
  nombre: String,
  firma: String,
  fecha: Date
});

export default mongoose.model('firmas', firmasSchema);


