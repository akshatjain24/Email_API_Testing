const con = require('../models/connection');

function schedule_interval(sched_id, interval){
    var query = "UPDATE schedule SET day_interval = ? WHERE sched_id = ?";
    con.query(query, [interval, sched_id], (err,result)=>{
        if (err) throw err;
        console.log("Updated day_interval for the schedule Schedule")
    })
}