import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  nombre: String,
  // Otros campos relacionados con la actividad
});

export default mongoose.model('Actividad', actividadSchema);
