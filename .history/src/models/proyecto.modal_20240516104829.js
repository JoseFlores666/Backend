import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
  id
  nombre: String,
  actividades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actividad'
  }]
});

export default mongoose.model('Proyecto', proyectoSchema);