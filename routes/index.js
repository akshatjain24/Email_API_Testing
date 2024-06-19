var express = require('express');
var router = express.Router();

const {redirection, submit_lead} = require('../controller/leads.js')
/* GET home page. */
router
  .route('/')
  .get(redirection)
  .post(submit_lead);

module.exports = router;
