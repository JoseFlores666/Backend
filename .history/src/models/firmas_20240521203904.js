const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmasSchema = new Schema({
  fases: String,
  Puesto: String,
  nombre: String,
 
  
 
});

export default mongoose.model('firmas', firmasSchema);


