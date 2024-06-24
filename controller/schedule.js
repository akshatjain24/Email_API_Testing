const con = require('../models/connection');

function submit_sched(req,res){
    let {sched_name, cat_id, interval, time, message} = req.body;
    let query = "INSERT INTO schedule (sched_name, day_interval, time, category_ref, template) VALUES (?, ?, ?, ?, ?)"
    con.query(query, [sched_name, interval, time, cat_id, message], (err, result)=>{
        if (err) throw err;
        console.log("The details of the schedule have been successfully saved to the database");
        var sched_id = result.insertId;
        process_schedule(cat_id,time,sched_id, interval);
        res.redirect('/');
    });
}

module.exports = submit_sched;