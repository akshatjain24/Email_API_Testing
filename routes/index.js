var express = require('express');
var router = express.Router();

const {redirection, submit_lead} = require('../controller/leads.js');
const {submit_cat, fetch_cat} = require('../controller/category.js');
const submit_sched = require('../controller/schedule.js');

/* GET home page. */
router
  .route('/')
  .get(redirection)
  .post(submit_lead);

router
  .route('/category')
  .get(fetch_cat)
  .post(submit_cat);

router.post('/schedule', submit_sched);

module.exports = router;