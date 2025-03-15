const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");


const { checkForAuthenticationCookie } = require("./middleweres/authentication");


mongoose.connect("mongodb://localhost:27017/blogify").then(() => console.log("Connected to database"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
   const allBlogs = await Blog.find();
  res.render("home" , {
    user: req.user,
    blogs: allBlogs
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
