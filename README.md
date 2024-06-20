# Email_API_Testing

Functionalities to be added later

-> Templates
-> When adding a lead or category make sure it is not alredy present in the database
-> On home page when category is selected show the number of leads in the selected category

mess_status -> 0:to be sent, 1: sent, 2: error sending message, 3: category/status of lead changed

Query for updating lead_count for all categories:
"UPDATE categories t2 JOIN(SELECT category_ref, COUNT(*) as lead_count FROM leads GROUP BY category_ref) t1 ON t2.cat_id = t1.category_ref SET t2.lead_count = t1.lead_count;"

Query to update lead_count for specific a specific schedule_id ->
'INSERT INTO messages (lead_ref, sched_ref, mess_date, mess_time, mess_status) SELECT lead_id, ?, ?, ?, 0 FROM leads WHERE category_ref = ? AND status = 1'