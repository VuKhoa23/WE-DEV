const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const User = require("../models/userModel");

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        res.redirect("/wedev/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/wedev/login");
  }
}

function checkCurrentUser(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

function requireAdminRole(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        if (user.role === "admin") {
          res.locals.user = user;
          next();
        } else {
          res.status(403).send("You dont have permission");
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkCurrentUser, requireAdminRole };
