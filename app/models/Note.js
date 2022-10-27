const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      max: 1024,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    important: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "notes",
  }
);

module.exports = mongoose.model("Notes", noteSchema);
