import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for now until auth is added
  },
  duration: {
    type: Number,
    required: [true, 'Please provide a duration in minutes'],
  },
  target: {
    type: String,
    required: [true, 'Please provide a target/goal for this session'],
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.models.FocusSession || mongoose.model('FocusSession', FocusSessionSchema);
