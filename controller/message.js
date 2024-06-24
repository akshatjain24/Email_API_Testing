const con = require('../models/connection');
const cron = require('node-cron');

function insert_message() {
    var date = new Date();
    var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    var today = new Date(date.getTime() + istOffset);
    var year = today.getUTCFullYear();
    var month = ('0' + (today.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    var day = ('0' + today.getUTCDate()).slice(-2); // Add leading zero if needed
    var today_date = `${year}-${month}-${day}`;
    var hours = today.getUTCHours();
    var minutes = today.getUTCMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    console.log(minutes, hours)
    var query = `INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time, mess_template, lead_phone, lead_email) SELECT leads.lead_id, schedule.sched_id, DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) AS date, schedule.time, schedule.template, leads.phone, leads.email 
                 FROM leads 
                 INNER JOIN schedule 
                 ON schedule.category_ref = leads.category_ref 
                 WHERE DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) = ? AND HOUR(schedule.time) = ? AND MINUTE(schedule.time) = ?;`;
    con.query(query, [today_date, hours, minutes], (err, result)=>{
        if (err) throw err;
        console.log(result);
        console.log(query);
    })
}































































































function send_message() {
    var date = new Date();
    var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    var today = new Date(date.getTime() + istOffset);
    var tomorrow = new Date(date.getTime() + istOffset + 24 * 60 * 60 * 1000)
    var year = today.getUTCFullYear();
    var month = ('0' + (today.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    var day = ('0' + today.getUTCDate()).slice(-2); // Add leading zero if needed
    var today_date = `${year}_${month}_${day}`;
    year = tomorrow.getUTCFullYear();
    month = ('0' + (tomorrow.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    day = ('0' + tomorrow.getUTCDate()).slice(-2); // Add leading zero if needed
    var tomorrow_date = `${year}_${month}_${day}`;
    var dropQuery1 = `DROP VIEW IF EXISTS day_${today_date}_view;`;
    var dropQuery2 = `DROP VIEW IF EXISTS day_${tomorrow_date}_view;`;
    var day1query = `CREATE VIEW day_${today_date}_view AS SELECT leads.lead_id, schedule.sched_id, DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) AS date,schedule.time, schedule.template, leads.email, leads.phone FROM leads RIGHT JOIN schedule ON schedule.category_ref = leads.category_ref WHERE DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) = ?`;
    var day2query = `CREATE VIEW day_${tomorrow_date}_view AS SELECT leads.lead_id, schedule.sched_id, DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) AS date,schedule.time, schedule.template, leads.email, leads.phone FROM leads RIGHT JOIN schedule ON schedule.category_ref = leads.category_ref WHERE DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) = ?`;
    con.query(dropQuery1, (err, result) => {
        if (err) throw err;
        console.log("Drop query1 executed for the day_view");
    });
    con.query(dropQuery2, (err, result) => {
        if (err) throw err;
        console.log('Drop query2 executed for the day_view')
    });
    con.query(day1query, [today_date], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for ", today_date);
    });
    con.query(day2query, [tomorrow_date], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for ", tomorrow_date);
    });


    var date = new Date();
    var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    var curr_hr_date = new Date(date.getTime() + istOffset);
    var next_hr_date = new Date(date.getTime() + istOffset + 60 * 60 * 1000);

    var year = curr_hr_date.getUTCFullYear();
    var month = ('0' + (curr_hr_date.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    var day = ('0' + curr_hr_date.getUTCDate()).slice(-2); // Add leading zero if needed
    var curr_date = `${year}_${month}_${day}`;
    year = next_hr_date.getUTCFullYear();
    month = ('0' + (next_hr_date.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
    day = ('0' + next_hr_date.getUTCDate()).slice(-2); // Add leading zero if needed
    var next_date = `${year}_${month}_${day}`

    var curr_hr = curr_hr_date.getUTCHours();
    var next_hr = next_hr_date.getUTCHours();
    var dropQuery1 = `DROP VIEW IF EXISTS hr_${curr_hr}_view;`
    var dropQuery2 = `DROP VIEW IF EXISTS hr_${next_hr}_view;`
    var hr1query = `CREATE VIEW hr_${curr_hr}_view AS SELECT * FROM day_${curr_date}_view WHERE HOUR(time) = ?;`;
    var hr2query = `CREATE VIEW hr_${next_hr}_view AS SELECT * FROM day_${next_date}_view WHERE HOUR(time) = ?;`;
    con.query(dropQuery1, (err, result) => {
        if (err) throw err;
        console.log('Drop query1 executed for the hr_view');
    });
    con.query(dropQuery2, (err, result) => {
        if (err) throw err;
        console.log('Drop query2 executed for the hr_view');
    })
    con.query(hr1query, [curr_hr], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for hour ", curr_hr);
    });
    con.query(hr2query, [next_hr], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for hour ", next_hr);
    });

    var date = new Date();
    var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    var curr_min_date = new Date(date.getTime() + istOffset);
    var next_min_date = new Date(date.getTime() + istOffset + 60 * 1000);

    var curr_min = curr_min_date.getUTCMinutes();
    var next_min = next_min_date.getUTCMinutes();
    var curr_hr = curr_min_date.getUTCHours();
    var next_hr = next_min_date.getUTCHours();
    var dropQuery1 = `DROP VIEW IF EXISTS min_${curr_min}_view;`;
    var dropQuery2 = `DROP VIEW IF EXISTS min_${next_min}_view;`;
    var min1query = `CREATE VIEW min_${curr_min}_view AS SELECT * FROM hr_${curr_hr}_view WHERE MINUTE(time) = ?;`;
    var min2query = `CREATE VIEW min_${next_min}_view AS SELECT * FROM hr_${next_hr}_view WHERE MINUTE(time) = ?;`;
    con.query(dropQuery1, (err, result) => {
        if (err) throw err;
        console.log('Drop query1 executed for the min_view');
    });
    con.query(dropQuery2, (err, result) => {
        if (err) throw err;
        console.log('Drop query2 executed for the min_view');
    })
    con.query(min1query, [curr_min], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for minute ", curr_min);
    });
    con.query(min2query, [next_min], (err, result) => {
        if (err) throw err;
        console.log("Created virtual table for minute ", next_min);
    });


    var insertquery = `INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time) SELECT lead_id, sched_id, date, time FROM min_${curr_min}_view`;
    con.query(insertquery, (err, result) => {
        if (err) throw err;
        console.log("Inserted row in the messages table");
    });

    cron.schedule('* * * * *', () => {
        var date = new Date();
        var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        var curr_min_date = new Date(date.getTime() + istOffset);
        var next_min_date = new Date(date.getTime() + istOffset + 60 * 1000);
        var prev_min_date = new Date(date.getTime() + istOffset - 60 * 1000);
        var next_min = next_min_date.getUTCMinutes();
        var prev_min = prev_min_date.getUTCMinutes();
        var curr_min = curr_min_date.getUTCMinutes();
        var next_hr = next_min_date.getUTCHours();
        var dropQuery = `DROP VIEW IF EXISTS min_${prev_min}_view;`;
        var insertquery = `INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time) SELECT lead_id, sched_id, date, time FROM min_${curr_min}_view;`;
        var minquery = `CREATE VIEW min_${next_min}_view AS SELECT * FROM hr_${next_hr}_view WHERE MINUTE(time) = ?;`;
        con.query(dropQuery, (err, result) => {
            if (err) throw err;
            console.log(`min_${prev_min}_view View Table dropped`);
            con.query(insertquery, (err, result) => {
                if (err) throw err;
                console.log("Insert query executed for the current minute: ", curr_min);
            })
            con.query(minquery, [next_min], (err, result) => {
                if (err) throw err;
                console.log(`min_${next_min}_view View Table created`)
            })
        });
    });

    cron.schedule('0 * * * *', () => {
        var date = new Date();
        var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        var prev_hr_date = new Date(date.getTime() + istOffset - 60 * 60 * 1000);
        var next_hr_date = new Date(date.getTime() + istOffset + 60 * 60 * 1000);

        var year = next_hr_date.getUTCFullYear();
        var month = ('0' + (next_hr_date.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
        var day = ('0' + next_hr_date.getUTCDate()).slice(-2); // Add leading zero if needed
        var next_date = `${year}_${month}_${day}`

        var prev_hr = prev_hr_date.getUTCHours();
        var next_hr = next_hr_date.getUTCHours();
        var dropquery = `DROP VIEW IF EXISTS hr_${prev_hr}_view;`;
        var hrquery = `CREATE VIEW hr_${next_hr}_view AS SELECT * FROM day_${next_date}_view WHERE HOUR(time) = ?;`;
        con.query(dropquery, (err, result) => {
            if (err) throw err;
            console.log(`Dropped the hour view table : hr_${prev_hr}_view`);
            con.query(hrquery, [next_hr], (err, result) => {
                if (err) throw err;
                console.log(`Created virtual table: hr_${next_hr}_view`);
            });
        });
    });

    cron.schedule('0 0 * * *', () => {
        var date = new Date();
        var istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        var yesterday = new Date(date.getTime() + istOffset - 24 * 60 * 60 * 1000)
        var tomorrow = new Date(date.getTime() + istOffset + 24 * 60 * 60 * 1000)
        var year = yesterday.getUTCFullYear();
        var month = ('0' + (yesterday.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
        var day = ('0' + yesterday.getUTCDate()).slice(-2); // Add leading zero if needed
        var yesterday_date = `${year}_${month}_${day}`;
        year = tomorrow.getUTCFullYear();
        month = ('0' + (tomorrow.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed
        day = ('0' + tomorrow.getUTCDate()).slice(-2); // Add leading zero if needed
        var tomorrow_date = `${year}_${month}_${day}`;
        var dropquery = `DROP VIEW IF EXISTS day_${yesterday_date}_view;`;
        var dayquery = `CREATE VIEW day_${tomorrow_date}_view AS SELECT leads.lead_id, schedule.sched_id, DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) AS date,schedule.time, schedule.template, leads.email, leads.phone FROM leads RIGHT JOIN schedule ON schedule.category_ref = leads.category_ref WHERE DATE_ADD(leads.ref_date, INTERVAL schedule.day_interval DAY) = ?`;
        con.query(dropquery, (err, result) => {
            if (err) throw err;
            console.log(`Dropped virtual table:  day_${yesterday_date}_view`);
            con.query(dayquery, [tomorrow_date], (err, result) => {
                if (err) throw err;
                console.log(`Created virtual table: day_${tomorrow_date}_view`);
            });
        });
    });
}

module.exports = insert_message