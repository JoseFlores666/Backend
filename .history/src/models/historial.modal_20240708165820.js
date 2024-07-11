import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accion: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    descripcion: {
      type: String,
      required: false,
    },
    tipo: {
      type: String,
      enum: ['info', 'warning', 'error'],
      default: 'info',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Historial', historialSchema);
