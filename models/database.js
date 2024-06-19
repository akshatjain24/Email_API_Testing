const mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "whatsapp_api_testing"
});

con.connect(function (err) {
	if (err) {
		console.error('Unable to connect to DB: ', err);
		return;
	}
})
module.exports = con;