var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "email_api"
});

con.connect(function (err) {
	if (err) {
		console.error('Unable to connect to DB: ', err);
		return;
	}console.log("Connected to Database");
});

module.exports = con;