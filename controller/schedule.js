const con = require('../models/database');

function process_schedule(cat_id, date, time, sched_id, ){
    let query = 'INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time, mess_status) SELECT lead_id, ?, ?, ?, 0 FROM leads WHERE category_ref = ? AND status = 1';
    con.query(query, [sched_id, date, time, cat_id], (err,result)=>{
        if(err) throw err;
        console.log("messages scheduled");
    });
}

function getDate(interval){
    const current = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(current.getTime() + istOffset + interval * 24 * 60 * 60 * 1000);
    const year = istTime.getUTCFullYear();
    const month = ('0' + (istTime.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    const day = ('0' + istTime.getUTCDate()).slice(-2); // Add leading zero if needed
    return `${year}-${month}-${day}`;
}

function submit_sched(req,res){
    let {sched_name, cat_id, interval, time, message} = req.body;
    let query = "INSERT INTO schedule (sched_name, day_interval, time, category_ref, template) VALUES (?, ?, ?, ?, ?)"
    con.query(query, [sched_name, interval, time, cat_id, message], (err, result)=>{
        if (err) throw err;
        let formattedDate = getDate(interval);
        console.log("The details of the schedule provided by you have been successfully saved to the database");
        var sched_id = result.insertId;
        process_schedule(cat_id,formattedDate,time,sched_id);
        res.redirect('/');
    });
}

module.exports = submit_sched;