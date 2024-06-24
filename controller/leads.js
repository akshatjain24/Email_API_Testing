const con = require('../models/connection');
// const mysql = require('mysql2/promise');

function redirection(req, res) {
    return res.render("index");
}

function process_lead(cat) {
    var query = "UPDATE categories SET lead_count = lead_count + 1 WHERE cat_id = (?)"
    con.query(query, [cat], (err, result) => {
        if (err) throw err;
        console.log("Updated lead count in categories table");
    })
}
const query = `CREATE VIEW day_view AS SELECT lead.lead_id, schedule.time, schedule.template FROM leads RIGHT JOIN schedule ON schedule.category_ref = leads.category_ref WHERE DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) = ?`;

// function mess_for_lead(cat_id, lead_id){
//     var query = `INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time, mess_status)
//                  SELECT 
//                      ?, 
//                      s.sched_id, 
//                      DATE_ADD(l.ref_date, INTERVAL s.day_interval DAY), 
//                      s.time, 
//                      0
//                  FROM 
//                      schedule s
//                  JOIN 
//                      leads l
//                  ON 
//                      s.category_ref = l.category_ref
//                  WHERE 
//                      s.category_ref = ?
//                  GROUP BY 
//                      s.sched_id, 
//                      l.ref_date, 
//                      s.day_interval, 
//                      s.time;`;
//     con.query(query, [lead_id, cat_id], (err, result)=>{
//         if (err) throw err;
//         console.log("Scheduled messages for the added lead")
//     });
// }

function submit_lead(req, res) {
    var { lead_name, lead_email, lead_phone, category } = req.body;
    var query = "INSERT INTO leads (lead_name, email, phone, category_ref, status) VALUES (?, ?, ?, ?, ?)";
    con.query(query, [lead_name, lead_email, lead_phone, category, 1], (err, result) => {
        if (err) throw err;
        console.log('Details of Lead submitted to Database');
        process_lead(category);
        let lead_id = result.insertId;
        // mess_for_lead(category, lead_id);
        var date = new Date();
    var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    var istTime= new Date(date.getTime() + istOffset);
    console.log(istTime.getUTCHours());
        res.redirect('/');
    });
}

module.exports = { redirection, submit_lead };