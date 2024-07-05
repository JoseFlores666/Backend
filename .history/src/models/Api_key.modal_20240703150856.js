import mongoose from 'mongoose';

const api_kSchema = new mongoose.Schema({
    solicitud: String,
    revision: String,
    validacion: String,
    autorizacion: String
  });
  
  export default mongoose.model('Firma', firmaSchema);
  