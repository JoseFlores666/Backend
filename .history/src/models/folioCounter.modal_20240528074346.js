import mongoose from 'mongoose';

const folioCounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 }
});

const FolioCounter = mongoose.model('FolioCounter', folioCounterSchema);

export default FolioCounter;
