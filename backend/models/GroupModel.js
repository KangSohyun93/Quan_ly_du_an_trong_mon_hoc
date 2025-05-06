const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  name: String,
  classId: Number,
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

module.exports = mongoose.model("Group", groupSchema);
