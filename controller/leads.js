const con = require('../models/database');
// const mysql = require('mysql2/promise');

function redirection(req, res) {
    return res.render("index");
}

function process_lead(cat){
    console.log("Process lead started");
    var query = "UPDATE categories SET lead_count = lead_count + 1 WHERE cat_id = (?)"
    con.query(query, [cat], (err,result)=>{
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
        process_lead(category);
        res.redirect('/');
    });
}

module.exports = { redirection, submit_lead };