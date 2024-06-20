const con = require('../models/database');
// const mysql = require('mysql2/promise');

function redirection(req, res) {
    return res.render("index");
}

function process_lead(){
    console.log("Process lead started");
    var query = "UPDATE categories t2 JOIN(SELECT category_ref, COUNT(*) as lead_count FROM leads GROUP BY category_ref) t1 ON t2.cat_id = t1.category_ref SET t2.lead_count = t1.lead_count;"
    con.query(query, (err,result)=>{
        if (err) throw err;
        console.log("Updated lead count in categories table");
    })
}

function submit_lead(req, res) {
    var { lead_name, lead_email, lead_phone, category } = req.body;
    var query = "INSERT INTO leads (lead_name, email, phone, category_ref, status) VALUES (?, ?, ?, ?, ?)";
    con.query(query, [lead_name, lead_email, lead_phone, category, 1], (err, result) => {
        if (err) throw err;
        console.log('Details of Lead submitted to Database');
        process_lead();
        res.redirect('/');
    });
}

module.exports = { redirection, submit_lead };