import mongoose from 'mongoose';

const firmaSchema = new mongoose.Schema({
    solicitud: String,
    revision: String,
    validacion: String,
    autorizacion: String
  });
  
  export default mongoose.model('Firma', firmaSchema);
  