const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" }); // File .env database
dotenv.config({ path: "./.env.github" }); // File .env cho GitHub

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
const assessmentRoutes = require("./routes/assessment-routes");
app.use("/api/peerassessment", assessmentRoutes);
const groupApiRoutes = require("./routes/groups-routes.js");
app.use("/api/groups", groupApiRoutes);
const commitApiRoutes = require("./routes/github-routes.js");
app.use("/api/projects", commitApiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Sever is running on http://localhost:${PORT}`)
);
