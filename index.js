const fs = require('fs')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const KoaSession = require('koa-session')
const KoaBodyParser = require('koa-bodyparser')
const KoaMulter = require('koa-multer')



const getOpenId = require('./routes/getOpenId')

// 用户
const getUser = require('./routes/user/get')
const postUser = require('./routes/user/post')
// 商品
const getProduct = require('./routes/product/get')
const postProduct = require('./routes/product/post')
const putProduct = require('./routes/product/put')
// 交易
const getTrade = require('./routes/trade/get')
const postTrade = require('./routes/trade/post')
const putTrade = require('./routes/trade/put')
// 记录
const postRecord = require('./routes/record/post')
// 上传图片
const postImage = require('./routes/image/post')


const app = new Koa()
const router = new KoaRouter()

const config = require('./config')


app.keys = ['some secret hurr']

const sessionConfig = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false, 
  renew: false
}

const multer = KoaMulter({ dest: 'public/assets/'})

router
  .post('/wxapp/getOpenId', getOpenId)
  .get('/wxapp/user', getUser)
  .post('/wxapp/user', postUser)
  .get('/wxapp/product', getProduct)
  .post('/wxapp/product', postProduct)
  .put('/wxapp/product', putProduct)
  .get('/wxapp/trade', getTrade)
  .post('/wxapp/trade', postTrade)
  .put('/wxapp/trade', putTrade)
  .post('/wxapp/record', postRecord)
  .post('/wxapp/upload', multer.single('image'), postImage)
  
app
	.use(KoaSession(sessionConfig, app))
  .use(KoaBodyParser())
	.use(router.routes())
	.use(KoaStatic('./public'))



app.listen(config.port, config.ip);
console.log(`已运行${config.ip}:${config.port}`)