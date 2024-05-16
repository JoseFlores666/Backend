import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
