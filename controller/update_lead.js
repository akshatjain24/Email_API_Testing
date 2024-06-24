const con = require('../models/connection');

function update_lead_phone(id, phone){
    var query = "UPDATE leads SET phone = ? WHERE lead_id = ?";
    con.query(query, [phone, id], (err, result)=>{
        if (err) throw err;
        console.log("Updated phone number of the lead");
    })
}

function update_lead_email(id, email){
    var query = "UPDATE leads SET email = ? WHERE lead_id = ?";
    con.query(query, [email, id], (err, result)=>{
        if (err) throw err;
        console.log("Updated email id of the lead");
    })
}

function update_lead_name(id , name){
    var query = "UPDATE leads SET lead_name = ? WHERE lead_id = ?";
    con.query(query, [name, id], (err, result)=>{
        if (err) throw err;
        console.log("Updated name of the lead");
    })
}

function update_lead_category(id, new_cat_ref, old_cat_ref){
    const current = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(current.getTime() + istOffset);
    const year = istTime.getUTCFullYear();
    const month = ('0' + (istTime.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    const day = ('0' + istTime.getUTCDate()).slice(-2); // Add leading zero if needed
    var upd_date = `${year}-${month}-${day}`;
    var query = `START TRANSACTION;
                 UPDATE leads SET category_ref = ?, date_ref = ? WHERE lead_id = ?;
                 UPDATE categories SET lead_count = lead_count - 1 WHERE cat_id = ?;
                 UPDATE categories SET lead_count = lead_count + 1 WHERE cat_id = ?;
                 COMMIT;`;
                //  UPDATE messages SET mess_status = 3 WHERE lead_ref = ? AND old_cat_ref = ? AND mess_status = 0;
                //  INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time, mess_status) VALUES (?, );
                 
    con.query(query, [new_cat_ref, upd_date, id, old_cat_ref, new_cat_ref], (err, result)=>{
        if (err) throw err;
        console.log("Updated name of the lead");
    })
}