var config = require('config');
var conf = {
	host     : config.get('db_host'),
	user     : config.get('db_user'),
	password : config.get('db_pass'),
	database : config.get('db_name')
}

var migrations_names = [
	'users',
	'items',
	'auctions',
	'user-items'
];

var migrations = [];


for(var i in migrations_names) {
	migrations[migrations_names[i]] = require('./migrations/'+migrations_names[i]);
}

/** final module to export */
export_obj = {

  	installTables: function(mysql) {
	  	var connection = mysql.createConnection(conf);

	  	for(var i in migrations) {
	  		migrations[i].install(connection);
	  	}
  	}
}

module.exports = export_obj;