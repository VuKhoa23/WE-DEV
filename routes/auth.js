const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

function authDirector(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        next();
      } else {
        console.log(decodedToken);
        res.redirect("/wedev/home");
      }
    });
  } else {
    next();
  }
}

/* GET home page. */
router.get("/signup", authDirector, authController.signup_get);

router.post("/signup", authController.signup_post);

router.get("/login", authDirector, authController.login_get);

router.post("/login", authController.login_post);

router.get("/logout", authController.logout_get);

module.exports = router;
