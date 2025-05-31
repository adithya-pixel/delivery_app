const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed');
    console.error('Error message:', err.message);
    console.error('Full error:', err); // Full detailed error output
    process.exit(1);
  }
};

module.exports = connectDB;
