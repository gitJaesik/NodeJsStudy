const bodyParser = require('body-parser');
const mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'oooo',
  database : 'study'
});
conn.connect();

module.exports = {
    conn: conn,
    bodyParser: bodyParser.urlencoded({extended: true})
};