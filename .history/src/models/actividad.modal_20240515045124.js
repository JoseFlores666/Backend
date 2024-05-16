import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  type: Number,
  unique: true, 
  required: true 
  ,
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
