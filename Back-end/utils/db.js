const mysql = require('mysql');
const opts = require('./opts');
const { promisify } = require('util');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: opts.DB.HOST,
  port: opts.DB.PORT,
  user: opts.DB.USER,
  password: opts.DB.PWD,
  database: opts.DB.DB_NAME,
  multipleStatements: true,
  typeCast: function castField( field, useDefaultTypeCasting ) {

		// We only want to cast bit fields that have a single-bit in them. If the field
		// has more than one bit, then we cannot assume it is supposed to be a Boolean.
		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

			var bytes = field.buffer();

			// A Buffer in Node represents a collection of 8-bit unsigned integers.
			// Therefore, our single "bit field" comes back as the bits '0000 0001',
			// which is equivalent to the number 1.
			return( bytes[ 0 ] === 1 );

		}

		return( useDefaultTypeCasting() );
	}
});

const pool_query = promisify(pool.query).bind(pool);

module.exports = {
  load: sql => pool_query(sql),
  add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
  del: (condition, tableName) => pool_query(`delete from ${tableName} where ?`, condition),
  patch: (entity, condition, tableName) => pool_query(`update ${tableName} set ? where ?`, [entity, condition]),
};
