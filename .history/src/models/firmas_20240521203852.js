const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmasSchema = new Schema({
  fases: String,
  nombre: String,
  Puesto: String,
  
 
});

export default mongoose.model('firmas', firmasSchema);


