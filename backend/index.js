const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test")
  .then(() => console.log("Successful connect with MongoDB"))
  .catch((err) => console.error("Cannot connect with MongoDB:", err));

// Routes
const authRoutes = require("./routes/auth-routes");
app.use("/api/auth", authRoutes);
const groupRoutes = require("./routes/group-routes");
app.use("/api/group/:id", groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Sever is running on http://localhost:${PORT}`)
);
