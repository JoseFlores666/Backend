import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const actividadSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true, // Asegúrate de que el ID sea único
    
  },
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
