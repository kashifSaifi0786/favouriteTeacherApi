const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const studentRouter = require("./routes/student");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();

mongoose
  .connect("mongodb://localhost:27017/clapingo")
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log("Something wrong with database!");
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);

app.listen(5000, () => {
  console.log("Backend Running on PORT 5000");
});
