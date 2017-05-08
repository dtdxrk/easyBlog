var express = require('express');
var router = express.Router();
var helper = require('../helper');
var PostModel = require('../models/post');
var dateFormat = require('date-format');

/* GET users listing. */
router.get('/', function(req, res, next) {

	var params = helper.getRequestParams(req);
	var id = params.id;
	var data = {};

	if (id) {
		var opt = {
			'_id': id
		};
		PostModel.findOne(opt, function(err, data) {
			console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.findOne', '参数：' + JSON.stringify(opt), 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));
			if (err) {
				console.log('err', JSON.stringify(err));
				return next(err);
			}
			res.render('post', {
				title: 'post',
				data: data
			});
		});
	} else {
		res.render('post', {
			title: 'post',
			data: data
		});
	}

});

/*提交文章*/
router.post('/', function(req, res, next) {

	var params = helper.getRequestParams(req);
	var id = params.id;

	var opt = {
		title: params.title,
		author: req.session.user.username,
		article: params.article,
		creatTime: dateFormat('yyyy-MM-dd hh:mm:ss', new Date())
	}

	if (id) {
		PostModel.update({_id: id}, {$set:opt}, function(err) {
			console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.update', '参数：' + JSON.stringify({_id: id}, {$set:opt}), 'err：' + JSON.stringify(err));
			if (err) {
				console.log('err', JSON.stringify(err));
				return res.json({
					status: 500,
					message: JSON.stringify(err)
				});
			}
			return res.json({
				status: 200,
				message: '提交成功'
			});
		});
	} else {
		var post = new PostModel(opt);

		post.save(function(err) {
			console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.findOne', '参数：' + JSON.stringify(opt), 'err：' + JSON.stringify(err));
			if (err) {
				console.log('err', JSON.stringify(err));
				return res.json({
					status: 500,
					message: JSON.stringify(err)
				});
			}
			return res.json({
				status: 200,
				message: '提交成功'
			});
		});
	}

});

/*删除文章*/
router.get('/del', function(req, res, next) {
	var params = helper.getRequestParams(req);
	var opt = {
		_id: params.id
	}
	PostModel.remove(opt, function(err) {
		console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：UserModel.findOne', '参数：' + JSON.stringify(opt), 'err：' + JSON.stringify(err));

		if (err) {
			console.log('err', JSON.stringify(err));
			return next(err)
		}

		return res.redirect('/'); //删除成功后返回首页
	});
});



module.exports = router;