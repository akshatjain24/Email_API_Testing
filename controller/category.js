const con = require('../models/database');

function submit_cat(req,res){
    let {cat_name} = req.body;
    var query = "INSERT INTO categories (cat_name) VALUES (?)";
    console.log(cat_name);
    con.query(query, [cat_name], (err,result)=>{
        if (err) throw err;
        console.log("Successfully inserted Category into the Database");
        res.redirect('/');
    });
}

function fetch_cat(req,res){
    var query = "SELECT cat_id, cat_name FROM categories";
    con.query(query, (err, result)=>{
        if (err) throw err;
        res.json(result)
    });
}

module.exports = {submit_cat, fetch_cat};