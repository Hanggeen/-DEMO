const pool = require('../pool');

module.exports = function (obj) {
	return new Promise((resolve, reject) => {

		console.log(obj)

		// 一个交易，需左连接到用户信息和产品信息
		let sql = 'SELECT t.id as id, user_id, avatar, buy_name, buy_phone, buy_address, buy_time, nickname, product_id, initial_price, current_price, t.floor_price as floor_price, status, deadline, t.createtime as createtime, name, picture from trade t left join product on t.product_id = product.id left join user on t.user_id = user.id ';
		let finalsql;
		let params = [];

		// 如果传入参数为空，直接返回空数组
		if (Object.keys(obj).length == 0) {
			return resolve([]);
		}

		// 如果对应字段不为空，则用该字段去搜索数据库
		// 设置对应的sql语句，还有准备好参数
		if (obj.id) {
			finalsql = sql + 'WHERE t.id = ?';
			params = obj.id;
		}
		else if (obj.user_id || obj.product_id || obj.status) {

			let searchsql = '';
			if (obj.user_id) {
				searchsql = searchsql + ' AND user_id = ?';
				params.push(obj.user_id);
			}
			if (obj.product_id) {
				searchsql = searchsql + ' AND product_id = ?';
				params.push(obj.product_id);
			}
			if (obj.status) {
				searchsql = searchsql + ' AND status = ?';
				params.push(obj.status);
			}

			searchsql = searchsql.replace(' AND', '');

			finalsql = sql + 'WHERE' + searchsql + ' ORDER BY t.createtime ASC;';

		}
		else if (obj.all == 1) {
			finalsql = sql + ' ORDER BY t.createtime ASC;'
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
			connection.query(finalsql, params, function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(err)
				}
				return resolve(rows);
			})	
		});

	})
}