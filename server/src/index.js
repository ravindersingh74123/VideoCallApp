require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const meetingsRouter = require("./routes/meetingsRoutes");
const usersRouter = require("./routes/users");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send({ message: "API is running" }));

app.use("/api/users", usersRouter);
app.use("/api/meetings", meetingsRouter);

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
