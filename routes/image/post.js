// 引入操作文件模块
const fs = require("fs");

// 对外返回接口
module.exports = async function(ctx, next){

  let originalname = ctx.req.file.originalname
  let setname = String(new Date().valueOf()) + originalname.slice(originalname.lastIndexOf(".")-originalname.length)

  let error
  let newpath = await new Promise(function(resolve, reject){
  // 把从缓存文件夹的照片保存成自己的路径
    fs.rename(ctx.req.file.path, "public/assets/"+setname, function(err){
      if (err) {
        reject(err)
      }
      // 返回告诉前端图片的目录
      let newpath = "/assets/" + setname;
      resolve(newpath)
    })
  }).catch(function(err){ error = err})

  if (error) {
    ctx.response.body = {
      status: 'err',
      data: '',
      msg: error
    }
    return next();
  }

  ctx.response.body = {
    status: 'ok',
    data: {
      path: newpath
    },
    msg: ''
  }
  next();
}
