const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Post = require("../../models/postModel");

module.exports.createPost = async (req, res, next) => {
  const content = req.body.content;
  console.log(req.body.userId);
  const user = await User.findOne({ _id: req.body.userId });
  const post = await Post.create({ content, owner: user._id });
  user.posts.push(post._id);
  await user.save();
  await post.populate("owner");
  res.status(200).json({ post });
};

module.exports.getPosts = async (req, res, next) => {
  const limit = req.query.limit;
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("owner")
    .limit(limit);

  res.status(200).json({ posts });
};

module.exports.deletePost = async (req, res, next) => {
  const _id = req.body.postId;
  await Post.findOneAndDelete({ _id });
  res.status(200).send("OK");
};
