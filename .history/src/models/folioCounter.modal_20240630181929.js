import mongoose from "mongoose";

const folioCounterSchema = new mongoose.Schema({
  counter: {
    type: Number,
    default: 0,
  },
  counterInforme: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("FolioCounter", folioCounterSchema);
