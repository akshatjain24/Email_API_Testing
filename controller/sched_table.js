const con = require('../models/connection');

function sched_table(req,res){
    var query =  `SELECT schedule.sched_name, schedule.template, schedule.day_interval, schedule.time, categories.cat_name FROM schedule LEFT JOIN categories ON schedule.category_ref = categories.cat_id`;
    con.query(query,(err,result)=>{
        if (err) throw err;
        console.log("Select query executed for fetching data for schedule table");
        res.render('schedule', {data: result})
    });
};

module.exports = sched_table;