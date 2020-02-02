const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'qlnganhang',
  multipleStatements: true
});

const pool_query = promisify(pool.query).bind(pool);

module.exports = {
  load: sql => pool_query(sql),
  add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
  del: (condition, tableName) => pool_query(`delete from ${tableName} where ?`, condition),
  patch: (entity, condition, tableName) => pool_query(`update ${tableName} set ? where ?`, [entity, condition]),
};
