const insertTrade = require('../../dao/trade/insertTrade')
const getProduct = require('../../dao/product/getProduct')
const calculate = require('../../tools/calculate')
const insertRecord = require('../../dao/record/insertRecord')

module.exports = async function (ctx, next) {

	const body = ctx.request.body

	if (!body.user_id || !body.product_id) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '缺少参数'
		}
		return next();
	}

	let error;

	// 获取产品信息
	let productMsg = await getProduct({id:body.product_id}).catch(err => { error = err})
	if (error || productMsg.length == 0) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: 'product_id参数错误'
		}
		return next();
	}


	// 获取此时的价格为原始价格
	let initial_price = productMsg[0].price;

	// 此时的底价为交易底价
	let floor_price = productMsg[0].floor_price

	// 随机生成本次砍价价格
	let killPrice = calculate({
		price: productMsg[0].price,
		floor_price: productMsg[0].floor_price,
		bargain_count: productMsg[0].bargain_count,
		bargain_slope: productMsg[0].bargain_slope,
		bargain_num: 1,
		random_percent: 0
	})

	// 计算当前价格
	let current_price = initial_price - killPrice;
	let status = 'going'

	// 如果是直接购买，当前价格不需要砍价
	if (body.justbuy == 1) {
		current_price = initial_price;
		status = 'bought';
	}

	// 计算此交易的过期时间，用当前时间加上有效期长
	let deadline = Number(Math.floor(new Date().valueOf()/1000)) + Number(productMsg[0].term);

	let ret = await insertTrade(body.user_id, body.product_id, initial_price, current_price, floor_price, body.buy_name || '', body.buy_phone || '', body.buy_address || '', body.buy_time || '', status,  deadline).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
		return next();
	}

	if (body.justbuy != 1) {
		// 开始自己砍价的那条记录
		await insertRecord(ret[0]['LAST_INSERT_ID()'], body.user_id, killPrice, current_price)
		if (error) {
			ctx.response.body = {
				status: 'fail',
				data: [],
				msg: '参数有误'
			}
			return next();
		}
	}


	ctx.response.body = {
		status: 'ok',
		data: {
			bargain: killPrice,
			tradeId: ret[0]['LAST_INSERT_ID()']
		},
		msg: ''
	}
	next();

}