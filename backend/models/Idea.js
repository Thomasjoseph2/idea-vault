const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Web App', 'Mobile App', 'Hardware', 'Tool', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Idea', ideaSchema);
