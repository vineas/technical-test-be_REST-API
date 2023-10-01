const express = require("express");
const router = express.Router();
const usersRouter = require('../routes/user')
const jobsRouter = require('../routes/jobs')

router.use('/jobs', jobsRouter);
router.use('/user', usersRouter);

module.exports = router;