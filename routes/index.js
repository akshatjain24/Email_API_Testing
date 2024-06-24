var express = require('express');
var router = express.Router();

const {redirection, submit_lead} = require('../controller/leads.js');
const {submit_cat, fetch_cat} = require('../controller/category.js');
const submit_sched = require('../controller/schedule.js');
const insert_message = require('../controller/message.js');
const sched_table = require('../controller/sched_table.js');
const lead_table = require('../controller/lead_table.js');
/* GET home page. */
router.get('/', redirection);

router
  .route('/leads')
  .post(submit_lead)
  .get(lead_table);

router
  .route('/category')
  .get(fetch_cat)
  .post(submit_cat);

router
  .route('/schedule')
  .get(sched_table)
  .post(submit_sched);

router.get('/messages', insert_message);

module.exports = router;