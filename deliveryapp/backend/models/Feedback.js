const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  complaints: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// ✅ Correct model name: 'Feedback' (not 'Address')
module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
