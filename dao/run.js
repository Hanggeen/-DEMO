var path  = require('path');
var fs = require("fs");
const param = process.argv[2]
const filepath = path.join(__dirname, param)

// 创建mysql实例
const mysql = require('mysql');

// 根据设置获取连接池
const pool  = mysql.createPool({
	connectionLimit : 10,
	host            : '127.0.0.1',
	user            : 'root',
	password        : '123456',
	database        : 'bargain',
	multipleStatements: true
});

// 异步读取
fs.readFile(filepath, function (err, data) {
	if (err) {
		return console.error(err);
	}
	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		}
		connection.query(data.toString(), function (error, rows, fields) {
			connection.release();
			if (error) { 
				throw(err)
			}
			for(let i = 0; i < rows.length; i++) {
			}
			console.log('执行完成')
			process.exit()
		})	
	});
});
