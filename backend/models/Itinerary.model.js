
import mongoose from 'mongoose';
import crypto from 'crypto';

const activitySchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['travel', 'accommodation', 'sightseeing', 'dining', 'leisure'],
  },
  location: String,
}, { _id: false });  // subdocs don't need their own _id, saves space

const daySchema = new mongoose.Schema({
  day: Number,
  date: Date,
  title: String,
  activities: [activitySchema],
}, { _id: false });

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  summary: String,
  days: [daySchema],
  shareToken: { type: String, unique: true, default: () => crypto.randomUUID() },  // generated at doc creation, not pre-save hook
  isPublic: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Itinerary', itinerarySchema);