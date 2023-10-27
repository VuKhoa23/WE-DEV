const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

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

const User = mongoose.model("user", userSchema);
module.exports = User;
