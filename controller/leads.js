const con = require('../models/database');
const mysql = require('mysql2/promise');
function redirection(req, res) {
    return res.render("index")
}

function submit_lead(req, res) {
    var { lead_name, lead_email, lead_phone, category } = req.body;
    var query = "INSERT INTO leads (lead_name, email, phone, category, status) VALUES (?, ?, ?, ?, ?)";
    con.query(query, [lead_name, lead_email, lead_phone, category, 0], (err, result) => {
        if (err) throw err;
        console.log('Details of Lead submitted to Database')
        res.redirect('/');
    });
}

module.exports = { redirection, submit_lead };