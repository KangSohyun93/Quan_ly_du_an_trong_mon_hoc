const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: './.env' }); // File .env database
dotenv.config({ path: './.github.env' }); // File .env cho GitHub

app.use(cors());
app.use(express.json());

const groupApiRoutes = require('./routes/groups-routes.js'); // File groups.js của bạn
app.use('/api/groups', groupApiRoutes);
const commitApiRoutes = require('./routes/github-routes.js'); // File commits.js của bạn
app.use('/api/projects', commitApiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Sever is running on http://localhost:${PORT}`)
);
