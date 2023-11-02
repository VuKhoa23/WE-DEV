const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWares");
const Post = require("../models/postModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  const email = res.locals.user === null ? "" : res.locals.user.email;
  res.render("index", { title: "Index", email: email });
});

router.get("/home", requireAuth, async function (req, res, next) {
  const email = res.locals.user === null ? "" : res.locals.user.email;
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("owner")
    .exec();
  res.render("home", { title: "Home", user: res.locals.user });
});

module.exports = router;
