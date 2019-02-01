const getTrade = require('../../dao/trade/getTrade')
const updateTrade = require('../../dao/trade/updateTrade')

module.exports = async function (ctx, next) {

	let error, ret;

	// 根据搜索条件获取交易
	ret = await getTrade(ctx.query).catch( err => { error = err })

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: error
		}
		return next();
	}

	// 遍历每一条交易，如果是进行中的，检查时间，发现超时，则更改为超时
	for (let i = 0; i < ret.length; i++) {

		ret[i].nickname = decodeURI(ret[i].nickname)
		if (ret[i].status == 'going' && (new Date()) - (new Date(ret[i].deadline * 1000)) > 0) {

			// 将即将返回的数据的状态改为超时
			ret[i].status = 'timeout';

			// 将数据库的数据改为超时
			await updateTrade({
				id: ret[i].id,
				status: 'timeout'
			}).catch(err => {error = err})

		}
	}

	ctx.response.body = {
		status: 'ok',
		data: ret,
		msg: ''
	}

	next();
}