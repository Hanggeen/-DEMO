const getTrade = require('../../dao/trade/getTrade')
const getRecord = require('../../dao/record/getRecord')
const updateTrade = require('../../dao/trade/updateTrade')
const getProduct = require('../../dao/product/getProduct')
const calculate = require('../../tools/calculate')
const insertRecord = require('../../dao/record/insertRecord')
const config = require('../../config.js')

module.exports = async function (ctx, next) {
	const body = ctx.request.body
	let error;

	// 如果参数不足，返回缺少参数
	if (!body.bargainer_id || !body.trade_id) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '缺少参数'
		}
		return next();
	}


	/******以下根据交易信息判断能不能砍价*******/


	// 根据trade_id数据库中获取指定交易信息
	let tradeMsgList = await getTrade({id: body.trade_id}).catch(err => { error = err})
	if (error || tradeMsgList.length == 0) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: 'trade_id参数有误'
		}
		return next();
	}
	// 把获取到的交易赋值给tradeMsg
	const tradeMsg = tradeMsgList[0]


	if (tradeMsg.status == 'bingo') {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '好友已砍到底价了啦~不能再砍了！'
		}
		return next();
	}

	if (tradeMsg.status == 'timeout') {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '好友的砍价已经超时了'
		}
		return next();
	}

	if (tradeMsg.status == 'bought') {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '好友已经购买了，不用再砍啦~'
		}
		return next();
	}



	// 判断此时此刻交易是否超时，是的话返回已结束
	if ( new Date().valueOf()/1000 > Number(tradeMsg.deadline)) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '好友的砍价已经超时了'
		}
		// 设置为结束
		updateTrade({
			id: body.trade_id,
			status: 'end'
		}).catch(err => { error = err;})

		return next();
	}


	/******以下根据已有砍价信息判断能不能砍价和能看多少*******/



	// 从数据库搜查，看看当前是第几个砍价
	let recordList = await getRecord(body.trade_id).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: 'trade_id参数有误'
		}
		return next();
	}
	let bargain_num = recordList.length + 1


	// 判断该用户是否已经砍过
	if (!config.allowBargainAgain) {
		if (recordList.length != 0) {
			let hadBargained = false
			for (let i = 0; i < recordList.length; i++) {
				if (recordList[i].bargainer_id == body.bargainer_id) {
					hadBargained = true
					break
				}
			}
			if (hadBargained) {
				ctx.response.body = {
					status: 'fail',
					data: [],
					msg: '你已经帮砍过啦~'
				}
				return next();
			}
		}
	}


	// 获取砍价的商品的信息
	let productMsg = await getProduct({id:tradeMsg.product_id}).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '数据库错误'
		}
		return next();
	}
	productMsg = productMsg[0]



	// 计算随机价格
	let bargainPrice = calculate({
		price: tradeMsg.initial_price,
		floor_price: tradeMsg.floor_price,
		bargain_count: productMsg.bargain_count,
		bargain_slope: productMsg.bargain_slope,
		bargain_num: bargain_num,
		random_percent: productMsg.bargain_range
	})

	let current_price;
	let finish = false;

	// 如果当前计算出的砍价，大于现在距离目标的差价，那么砍价就直接等于差价就好了
	if (bargainPrice > (tradeMsg.current_price - productMsg.floor_price)) {
		bargainPrice = tradeMsg.current_price - productMsg.floor_price
		current_price = productMsg.floor_price
		finish = true
	} else {
		current_price = tradeMsg.current_price - bargainPrice
	}


	// 开始插入交易
	let ret = await insertRecord(body.trade_id, body.bargainer_id, bargainPrice, current_price)
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: 'trade_id参数有误'
		}
		return next();
	}

	if (finish) {
		updateTrade({
			id: body.trade_id,
			status: 'bingo'
		}).catch(err => { error = err;console.log(error)})
	}

	ctx.response.body = {
		status: 'ok',
		data: {
			bargainPrice: Math.floor(bargainPrice*100)/100,
			current_price: current_price
		},
		msg: ''
	}

	next();

}