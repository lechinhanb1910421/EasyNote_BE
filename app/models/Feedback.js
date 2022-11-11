const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    category: {
      type: String,
      required: true,
      min: 8,
      max: 255
    },
    description: {
      type: String,
      required: true,
      max: 1024
    },
    createDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'feedbacks'
  }
)
module.exports = mongoose.model('Feedback', feedbackSchema)
