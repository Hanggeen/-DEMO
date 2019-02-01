const pool = require('../pool');

module.exports = function (obj) {
	return new Promise((resolve, reject) => {

		let sql, params;

		// 如果传入参数为空，直接返回空数组
		if (Object.keys(obj).length == 0) {
			return resolve([]);
		}

		// 如果对应字段不为空，则用该字段去搜索数据库
		// 设置对应的sql语句，还有准备好参数
		if (obj.id) {
			sql = 'SELECT * FROM product WHERE id = ?';
			params = obj.id;
		}
		else if (obj.able == 1) {
			sql = 'SELECT * FROM product WHERE able = 1';
			params = null;
		}
		else if (obj.able == 0) {
			sql = 'SELECT * FROM product WHERE able = 0';
			params = null;
		}
		else if (obj.all == 1) {
			sql = 'SELECT * FROM product';
			params = null;
		}
		else {
			return resolve([]);
		}

		// 执行
		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query(sql, params, function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(err)
				}
				return resolve(rows);
			})	
		});

	})
}