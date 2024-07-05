import mongoose from "mongoose";

const api_keySchema = new mongoose.Schema({
  Api_key: String,
});

export default mongoose.model("Firma", firmaSchema);
