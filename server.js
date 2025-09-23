require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activity");
const preachingRoutes = require("./routes/preachingStatus");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/activities", activityRoutes);
app.use("/preachingStatus", preachingRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
