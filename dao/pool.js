// 创建mysql实例
const mysql = require('mysql');
const config = require('../config.js')

// 根据设置获取连接池
const pool  = mysql.createPool({
	connectionLimit : 10,
	host            : '127.0.0.1',
	user            : config.user,
	password        : config.password,
	database        : 'bargain'
});

// 返回该连接池
module.exports = pool;