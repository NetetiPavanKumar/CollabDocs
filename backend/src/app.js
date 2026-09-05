const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CollabDocs API is running"
  });
});

app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

module.exports = app;