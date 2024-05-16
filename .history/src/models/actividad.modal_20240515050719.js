import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const actividadSchema = new mongoose.Schema({
  id:String,
  nombre: String,
});

export default mongoose.model('Actividad', actividadSchema);
