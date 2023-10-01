const express = require('express');
const router  = express.Router();
const userController = require('../controller/user');
const {protect} = require('../middleware/auth')

router
  .get("/", protect, userController.getAllUser)
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)

module.exports = router;