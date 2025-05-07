const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    unique: true,
    required: true,
  },
  description: String,
  toolsUsed: String,
  status: {
    type: String,
    enum: ["Ongoing", "Completed", "Cancelled"],
    default: "Ongoing",
  },
  githubRepoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
