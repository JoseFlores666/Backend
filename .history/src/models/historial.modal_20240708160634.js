import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
  nombre: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  accion: Str,
});

export default mongoose.model("Actividad", actividadSchema);
