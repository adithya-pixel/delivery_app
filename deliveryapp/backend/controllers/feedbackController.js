const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'You are not logged in. Please login first.' });
    }

    const feedback = new Feedback({
      user_id: new mongoose.Types.ObjectId(userId),
      complaints: req.body.complaints,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json({ message: 'Complaint submitted successfully', feedback: savedFeedback });
  } catch (err) {
    res.status(500).json({ message: 'Error saving feedback', error: err.message });
  }
};