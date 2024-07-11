import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  accion: String,
});

export default mongoose.model("Actividad", actividadSchema);
