const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupNumber: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi class chỉ có 1 groupNumber duy nhất
groupSchema.index({ classId: 1, groupNumber: 1 }, { unique: true });

module.exports = mongoose.model("Group", groupSchema);
