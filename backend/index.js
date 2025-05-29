const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Routes
const classRoutes = require("./routes/class-routes");
app.use("/api/class", classRoutes);
const authRoutes = require("./routes/auth-routes");
app.use("/api/auth", authRoutes);
const groupRoutes = require("./routes/group-routes");
app.use("/api/group/:id", groupRoutes);
const taskRoutes = require("./routes/task-routes");
app.use("/api/tasks", taskRoutes);
const userRoutes = require("./routes/user-routes");
app.use("/api/user", userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Sever is running on http://localhost:${PORT}`)
);
