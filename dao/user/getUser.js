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
			sql = 'SELECT * FROM user WHERE id = ?';
			params = obj.id;
		}
		else if (obj.openid) {
			sql = 'SELECT * FROM user WHERE openid = ?';
			params = obj.openid;
		}
		else if (obj.tradeid) {
			sql = 'SELECT u.id as user_id, u.nickname as nickname, u.avatar as avatar, u.gender as gender, r.bargain_price as bargain_price, r.createtime as time FROM record r LEFT JOIN user u ON  r.bargainer_id = u.id WHERE trade_id = ?';
			params = obj.tradeid;
		}
		else if (obj.all == 1) {
			sql = 'SELECT * FROM user';
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