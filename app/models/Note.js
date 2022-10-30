const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 50
    },
    description: {
      type: String,
      required: true,
      max: 1024
    },
    createDate: {
      type: Date,
      default: Date.now
    },
    important: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'planning'
    }
  },
  {
    collection: 'notes'
  }
)

module.exports = mongoose.model('Notes', noteSchema)
