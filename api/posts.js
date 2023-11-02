const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const postController = require("../controllers/api/postController");

/* GET home page. */
router.post("/posts", postController.createPost);

router.get("/posts", postController.getPosts);

module.exports = router;
