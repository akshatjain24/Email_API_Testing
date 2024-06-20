const con = require('../models/database');

function submit_sched(req,res){
    let {sched_name, cat_id, interval, time} = req.body;
    let query = "INSERT INTO schedule (sched_name, day_interval, time, category_ref) VALUES (?, ?, ?, ?)"
    con.query(query, [sched_name, interval, time, cat_id], (err, result)=>{
        if (err) throw err;
        console.log("Details of Schedule successfully saved to the database");
        res.redirect('/');
    })
}

module.exports = submit_sched;