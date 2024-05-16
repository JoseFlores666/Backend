import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  id:String,
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
