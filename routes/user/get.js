const getUser = require('../../dao/user/getUser');

module.exports = async function (ctx, next) {
	
	let ret, error;

	ret = await getUser(ctx.query).catch(err => { error = err })

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: error
		}
	} else {
		for (let i = 0; i < ret.length; i++) {
			ret[i].nickname = decodeURI(ret[i].nickname)
			ret[i].name = decodeURI(ret[i].nickname)
		}
		ctx.response.body = {
			status: 'ok',
			data: ret,
			msg: ''
		}
	}

	next();

}