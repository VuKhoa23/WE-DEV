const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWares");

/* GET home page. */
router.get("/", function (req, res, next) {
  const email = res.locals.user === null ? "" : res.locals.user.email;
  res.render("index", { title: "Index", email: email });
});

router.get("/home", requireAuth, function (req, res, next) {
  const email = res.locals.user === null ? "" : res.locals.user.email;
  res.render("home", { title: "Home", email: email });
});

module.exports = router;
