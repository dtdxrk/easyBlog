var express = require('express');
var router = express.Router();
var helper = require('../helper');
var UserModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});


router.post('/', function(req, res, next) {

	var params = helper.getRequestParams(req);

	UserModel.findOne({
		'username': params.username
	}, function(err, data) {
		console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：UserModel.findOne', '参数：' + JSON.stringify(params.username), 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));

		if (err) {
			console.log('err', JSON.stringify(err));
			return res.json({
				status: 500,
				message: JSON.stringify(err)
			});
		}
		if (!data) {
			return res.json({
				status: 500,
				message: '该用户不存在'
			});
		} 
		if (data.password != params.password){
			return res.json({
				status: 500,
				message: '密码错误'
			});
		}else{
			req.session.user = data;
			return res.json({
				status: 200,
				message: '登陆成功'
			});
		}
		
	});

});


//退出登录
router.get('/out',function (req, res) {
     req.session.user = null;
     res.redirect('/');//登出成功后跳转到主页
 });

module.exports = router;
