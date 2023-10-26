const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/signup', userController.signup_get);
router.get('/login', userController.login_get);
router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.get('/logout', userController.logout_get);

module.exports = router;
