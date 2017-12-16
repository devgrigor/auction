var config = require('config');
var conf = {
	host     : config.get('db_host'),
	user     : config.get('db_user'),
	password : config.get('db_pass')
};

var mysql = require('mysql');
var db_sceme = require('./database-scheme');

var connection = mysql.createConnection(conf);
/** Installing database with all tables */
function install() {
  connection.connect();

  connection.query(`DROP DATABASE IF EXISTS ` + config.get('db_name'));

  connection.query(`CREATE DATABASE IF NOT EXISTS ` + config.get('db_name') +` COLLATE = utf8_general_ci;`,
  	function (error, results, fields) {
	    if (error) throw error;
	    
	    console.log('database created successfully');

	    db_sceme.installTables(mysql);
  });
}

install();