const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWares");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Index" });
});

router.get("/home", requireAuth, function (req, res, next) {
  res.render("home", { title: "Home" });
});

module.exports = router;
