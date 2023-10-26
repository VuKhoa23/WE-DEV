const mongoose = require("mongoose");
const { isEmail } = require("validator");

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
    gender: ["male", "female"],
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
