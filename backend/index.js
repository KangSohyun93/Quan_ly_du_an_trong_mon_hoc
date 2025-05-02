const express = require("express");
const taskRoutes = require("./routes/task-routes");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();

// Enable CORS for requests from localhost:3000
app.use(cors({
  origin: "http://localhost:3000", // Allow only this origin
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

app.use(express.json());
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});