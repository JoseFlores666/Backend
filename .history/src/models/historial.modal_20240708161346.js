import mongoose from "mongoose";

const historialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    accion: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Historial", historialSchema);
