var express = require('express');
var router = express.Router();
var helper = require('../helper');

var mongoose = require('mongoose');
var UserModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('reg', {
		title: 'reg'
	});
});

router.post('/', function(req, res, next) {
	var params = helper.getRequestParams(req);
	var user = new UserModel({
		username: params.username,
		password: params.password,
	});

	UserModel.findOne({
		'username': user.username
	}, function(err, data) {
		console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：UserModel.findOne', '参数：' + JSON.stringify(user), 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));

		if (err) {
			console.log('err', JSON.stringify(err));
			return res.json({
				status: 500,
				message: JSON.stringify(err)
			});
		}
		if (data != null) {
			return res.json({
				status: 500,
				message: '该用户已存在'
			});
		} else {
			//保存新的用户
			user.save(function(err) {
				if (err) {
					console.log('err', 'user.save',JSON.stringify(err));
					return res.json({
						status: 500,
						message: JSON.stringify(err)
					});
				}
				return res.json({
					status: 200,
					message: '注册用户成功'
				});
			})
		}
	});
});

module.exports = router;