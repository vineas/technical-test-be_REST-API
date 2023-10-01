const express = require('express');
const router  = express.Router();
const {protect} = require('../middleware/auth')
const jobsController = require('../controller/jobs');

router
  .get("/", jobsController.getAllJobs)
  .get("/:id", jobsController.getDetailJobs)
  .post("/", jobsController.jobsCreate)
  .put("/:id", jobsController.jobsUpdate)
  .get("/search", jobsController.getSearchJobs)

module.exports = router;