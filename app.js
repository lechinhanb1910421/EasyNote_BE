const express = require("express");
const cors = require("cors");

const ApiError = require("./app/api-error");
const notesRouter = require("./app/routes/note.route");
const accountsRouter = require("./app/routes/account.route");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use("/api/accounts", accountsRouter);
const config = require('./app/config')
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("Connected to mongodb via mongoose");
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to book API application",
  });
});
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});
const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;
