import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  nombre: String,
  "descripcion": 
});

export default mongoose.model('Actividad', actividadSchema);
