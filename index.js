const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const userRouter = require("./routes/user");


mongoose.connect("mongodb://localhost:27017/blogify").then(() => console.log("Connected to database"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
