const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const postSchema = new mongoose.Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: [true, "Blank post content"],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
