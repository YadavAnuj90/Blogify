const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/comment/:blogId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const newBlog = await Blog.create({
      title,
      body,
      coverImageURL: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${newBlog._id}`);
  } catch (err) {
    console.error("Error creating blog:", err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;