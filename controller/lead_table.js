const con = require('../models/connection');

function lead_table(req,res){
    var query =  `SELECT leads.lead_name, categories.cat_name, leads.email, leads.phone, leads.ref_date, leads.status FROM leads LEFT JOIN categories ON leads.category_ref = categories.cat_id`;
    con.query(query,(err,result)=>{
        if (err) throw err;
        console.log("Select query executed for fetching data for leads table");
        res.render('leads', {data: result});
    });
};

module.exports = lead_table;