import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const actividadSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
