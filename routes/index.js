var express = require('express');
var router = express.Router();

const {redirection, submit_lead} = require('../controller/leads.js');
const {submit_cat, fetch_cat} = require('../controller/category.js');

/* GET home page. */
router
  .route('/')
  .get(redirection)
  .post(submit_lead);

router
  .route('/category')
  .get(fetch_cat)
  .post(submit_cat);

module.exports = router;
