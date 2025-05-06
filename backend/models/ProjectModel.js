const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  classId: Number,
  description: String,
  status: {
    type: String,
    enum: ["Ongoing", "Completed", "Cancelled"],
    default: "Ongoing",
  },
  githubRepoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
