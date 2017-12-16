var model = {}
var mysql 	= require('mysql');
var config = require('config');
var conf = {
	host     : config.get('db_host'),
	user     : config.get('db_user'),
	password : config.get('db_pass'),
	database  : config.get('db_name')
};
var connection = mysql.createConnection(conf);

// TODO: refactor comments

/**
	Building a query for select
	@param query string | the start query to build on
	@param offset int
	@param filters array{field: string, sign:string, val: string}
	@param sort object{field: string, order: string}
*/
model.buildSelect = function(query, offset, limit, filters, sort, condition_type) {
	// adding filters and where conditions
	for (var i in filters) {
		if(i == 0) {
			query += " where ";
		}

		if(i > 0 && i < filters.length) {
			query += ' '+condition_type+' ';
		}
		if(filters[i].sign == 'like') {
			filters[i].val = '%'+filters[i].val+'%';
		}

		query += filters[i].field + ' ' + filters[i].sign + ' '+ mysql.escape(filters[i].val);

		if(filters[i].additional) {
			query += ' ' + filters[i].additional + ' ';
		}
	};

	if(sort != false) {
		if(!sort.order) {
			sort.order = 'asc';
		}

		query += ' order by ' + sort.field + ' ' + sort.order;
	}

	query += ' limit '+offset+','+limit;

	return query;
}

/** 
 * Building the delete query based on filters
 * @param query String, 
 * @param filters Array
 */
model.buildDelete = function(table, filters) {
	var query = "delete from " + table;

	for (var i in filters) {
		if(i == 0) {
			query += " where ";
		}

		if(i > 0 && i < filters.length) {
			query += ' '+condition_type+' ';
		}

		query += filters[i].field + ' ' + filters[i].sign + ' '+ mysql.escape(filters[i].val);
	};

	return query;
}

// Building the insert query in db
model.buildInsert = function(table, data) {
	var query = "Insert into " + table + " (";

	for(var i in data) {
		query += i+',';
	}

	// removing the last comma
	query = query.substring(0, query.length - 1);

	query += ') values (';

	for(var i in data) {
		if(typeof data[i] == 'string')
		{
			query += mysql.escape(data[i])+',';
		} else {
			query += data[i]+',';
		}		
	}

	query = query.substring(0, query.length - 1);
	query += ')';

	return query;
}

model.buildUpdate = function(table, data, condition) {
	var query = "update "+ table + " set ";

	for(var i in data) {
		if(typeof data[i] == 'string')
		{
			query += i + '=' + mysql.escape(data[i])+",";
		} else {
			// If it's not string then there is no need to ecape the number
			query += i + '=' + data[i] + ',';
		}
	}

	// removing the last comma
	query = query.substring(0, query.length - 1);

	query += ' where '+ condition.field +' '+ condition.sign +' '+ mysql.escape(condition.val);

	return query;
}

/**
 * building join for two tables , can be used insead of building select 
 * default join is left
 * conditions are mostly used with sign `=` , but can be used different way, so th format is 
	{
		first_table_field: string,
		second_table_field: string,
		sign: string
 	}
 */
model.buildJoin = function(first_table, second_table, condition, join_type="left", fields = "*") {
	var query = 'select ' + fields +' from '+ first_table + ' ' + join_type + ' join ' + second_table;

	query += ' on';
	query += ' ' + first_table + '.' + condition.first_table_field;
	query += ' = ';
	query += ' ' + second_table + '.' + condition.second_table_field;

	return query;
}

// adding joins to existing one
model.addJoin = function(query, first_table, second_table, condition, join_type="left", sign = '=') {
	query += ' ' + join_type + ' join ' + second_table + ' on ';
	query += ' ' + first_table + '.' + condition.first_table_field;
	query += ' '+ sign +' ';
	query += ' ' + second_table + '.' + condition.second_table_field;

	if(condition.additional) {
		query += ' '+condition.additional + ' ';
	}

	return query;
}

// Build and run a select query based on given params and call callback  on success
model.selectQuery = function(query, callback, offset=0, limit=1000, filters=[], sort=false, condition_type="or"){
	query = this.buildSelect(query, offset, limit, filters, sort, condition_type);

	console.log(query);

	connection.query(query, function(err, rows, fields){
		if (err) throw err;

		callback(rows);
	});
}

// Build and run a insert query based on given params and call callback  on success
model.insertQuery = function(table, data, callback) {
	var query = this.buildInsert(table, data);

	console.log(query);

	connection.query(query, function(err, rows, fields){
		if (err) throw err;
		
		callback(rows);
	});
}

// Build and run a update query based on given params and call callback  on success
model.updateQuery = function(table, data, condition, callback ) {
	var query = this.buildUpdate(table, data, condition);

	console.log(query);

	connection.query(query, function(err, rows, fields){
		if (err) throw err;
		
		callback(rows);
	});
}

// Build and run a delete query based on given params and call callback  on success
model.deleteQuery = function(table, condition, callback) {
	var query = this.buildDelete(table, condition);

	console.log(query);

	connection.query(query, function(err, rows, fields){
		if (err) throw err;
		
		callback(rows);
	});
}

// This function is for special cases only, it doesn't have protection from xss attacs so be carefull in usage
model.runCustomQuery = function(query, callback) {
	console.log(query);

	
	connection.query(query, function(err, rows, fields){
		if (err) throw err;
		
	});
}

module.exports = model;