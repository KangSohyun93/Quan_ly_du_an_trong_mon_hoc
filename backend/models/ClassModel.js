const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semester: String,
  secretCode: { type: String, unique: true, maxlength: 10 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Class", classSchema);
