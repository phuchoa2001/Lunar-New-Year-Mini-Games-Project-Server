const mongoose = require('mongoose');

// Định nghĩa mô hình cho PageView
const pageViewSchema = new mongoose.Schema({
  views: {
    type: Number,
    required: true
  }
});

const PageView = mongoose.model('PageView', pageViewSchema);

module.exports = PageView;