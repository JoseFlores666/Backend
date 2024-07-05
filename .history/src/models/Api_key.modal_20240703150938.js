import mongoose from 'mongoose';

const api_keySchema = new mongoose.Schema({
   
    autorizacion: String
  });
  
  export default mongoose.model('Firma', firmaSchema);
  