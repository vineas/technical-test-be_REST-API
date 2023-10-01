const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth')
const jobsController = require('../controller/jobs');

router
  .get("/", jobsController.getAllJobs)
  .get("/search", protect, jobsController.getSearchJobs)
  .get("/:id", jobsController.getDetailJobs)
  .post("/", jobsController.jobsCreate)
  .put("/:id", jobsController.jobsUpdate)

module.exports = router;