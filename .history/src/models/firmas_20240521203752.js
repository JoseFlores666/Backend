const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firmasSchema = new Schema({
  Estado: String,
  nombre: String,
  Puesto: String,
  'Otro Departamento'  ],             // Agrega más áreas según sea necesario],/*Agrega que mas puede recibir*/ 
 
});

export default mongoose.model('firmas', firmasSchema);


