const insertUser = require('../../dao/user/insertUser')
const getUser = require('../../dao/user/getUser')

module.exports = async function (ctx, next) {

	// 初始化时，小程序能获取到openid等信息
	// 但是不知道，这个用户是不是已经存在于数据库
	// 所以要做一个搜索，存在的话，返回信息，不存在，就插入数据，再返回信息

	const body = ctx.request.body

	if (!body.openid || !body.avatar || body.gender == undefined || !body.nickname) {
		ctx.response.body = {
			status: 'fail',
			data: '缺少参数'
		}
		return next();
	}

	let error = null

	// 根据openid搜索是否有该用户
	let searchResult = await getUser({openid: body.openid}).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
		return next()
	}

	// 搜索有结果，直接返回该结果
	if (searchResult.length !== 0) {
		ctx.response.body = {
			status: 'ok',
			data: searchResult[0],
			msg: ''
		}
		return next();
	}


	// 搜索无果，插入信息
	let codednickname = encodeURI(body.nickname)
	await insertUser(body.openid, body.avatar, body.gender, codednickname).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
		return next();
	}

	// 插入后，在搜多次吧
	let ret = await getUser({openid: body.openid}).catch(err => { error = err})
	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
		return next()
	}

	ctx.response.body = {
		status: 'ok',
		data: ret[0],
		msg: ''
	}
	next();

}