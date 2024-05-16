import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  id:,
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
