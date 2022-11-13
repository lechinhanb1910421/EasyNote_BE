const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    lastName: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 255
    },
    createDate: {
      type: Date,
      default: Date.now
    },
    profilePic: {
      type: String,
      default: 'src/assets/imgs/default_user.jpg'
    },
    role: {
      type: String,
      default: 'normal'
    }
  },
  {
    collection: 'accounts'
  }
)
module.exports = mongoose.model('Account', accountSchema)
