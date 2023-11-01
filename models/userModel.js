const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Post = require("../models/postModel");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Blank username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Blank email"],
    unique: true,
    validate: [isEmail, "Not valid email"],
  },
  password: {
    type: String,
    required: [true, "Blank password"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  address: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post("findOneAndRemove", async function (doc) {
  await Post.deleteMany({ owner: doc._id });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
