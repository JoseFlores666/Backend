import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true, // Asegúrate de que el ID sea único
    
  },
  nombre: String,
  actividades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actividad'
  }]
});

export default mongoose.model('Proyecto', proyectoSchema);