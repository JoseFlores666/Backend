import mongoose from 'mongoose';

const suministroSchema = new mongoose.Schema({
  cantidad: Number,
  unidadMedida: String,
  descripcion: String,
  cantidadEntregada: Number
});

export default mongoose.model('Suministro', suministroSchema);
