import mongoose from 'mongoose';

// Individual activity log entry
const ActivityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['family', 'friends', 'parties', 'outings'],
    required: true,
  },
  label: { type: String, required: true },       // e.g. "Called Mom", "Dinner with friends"
  duration: { type: Number, default: 0 },         // minutes
  notes: { type: String, default: '' },
  loggedAt: { type: Date, default: Date.now },
});

// Daily snapshot of social metrics
const SocialMetricsSchema = new mongoose.Schema({
  // No userId for now (no auth yet) — use a fixed "default" key
  sessionKey: { type: String, default: 'default' },

  // Date of this snapshot (stored as YYYY-MM-DD string for easy querying)
  date: { type: String, required: true },

  // The four metric scores (0-100)
  metrics: {
    family:  { type: Number, default: 0, min: 0, max: 100 },
    friends: { type: Number, default: 0, min: 0, max: 100 },
    parties: { type: Number, default: 0, min: 0, max: 100 },
    outings: { type: Number, default: 0, min: 0, max: 100 },
  },

  // Activity logs for the day
  activities: [ActivityLogSchema],
}, { timestamps: true });

// Compound index: one document per (sessionKey + date)
SocialMetricsSchema.index({ sessionKey: 1, date: 1 }, { unique: true });

export default mongoose.models.SocialMetrics ||
  mongoose.model('SocialMetrics', SocialMetricsSchema);
