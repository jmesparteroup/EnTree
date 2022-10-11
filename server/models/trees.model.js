const mongoose = require("mongoose");

class Trees {
  constructor(data) {
    this.location = data.location;
    this.timestamp = data.timestamp;
    this.uploader = data.uploader;
  }
}

const treeSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  timestamp: {
    type: Date,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
});

const Tree = mongoose.model("Tree", treeSchema);

module.exports = { Tree, Trees };
