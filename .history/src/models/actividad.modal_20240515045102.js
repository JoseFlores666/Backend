import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const actividadSchema = new mongoose.Schema({
  type: Number,
  unique: true, 
  required: true // Asegúrate de que el ID sea requerido
,
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
