import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  name: {
    type: String,
  },
  stats: {
    streak: { type: Number, default: 0 },
    totalFocusHours: { type: Number, default: 0 },
    activeGoals: { type: Number, default: 0 },
    goalCompletionLevel: { type: Number, default: 0 }
  },
  quadrants: {
    mentally: { type: Number, default: 50 },
    financially: { type: Number, default: 50 },
    socially: { type: Number, default: 50 },
    physically: { type: Number, default: 50 }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
