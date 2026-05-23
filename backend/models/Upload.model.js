
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  mimeType: { type: String },
  filePath: { type: String },  // local path, used in dev; s3 fields used in prod     
  s3Key: { type: String },          
  s3Url: { type: String },         
  fileSize: { type: Number },
  extractedData: { type: mongoose.Schema.Types.Mixed, default: null },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Upload', uploadSchema);