var express = require('express');
var router = express.Router();
var helper = require('../helper');
var PostModel = require('../models/post');
var async = require('async');


/* GET home page. */
router.get('/', function(req, res, next) {
	var params = helper.getRequestParams(req);

	/*当前页数*/
	var page = params.page || 1;
	var pageCount = 2;
	var author = params.author;

	var opt = {};
	if (author) {
		opt.author = author;
	}

	async.parallel({
		count: function(cb) {
			/*获取总数*/
			PostModel.count(opt, function(err, data) {
				console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.count', '参数：' + JSON.stringify(opt), 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));
				if (err) {
					console.log('err', JSON.stringify(err));
					return next(err);
				}
				return cb(null, data)
			});
		},
		list: function(cb) {
			/*翻页数据*/
			PostModel.find(opt, null, {
				sort: {
					'_id': -1
				},
				skip: (page - 1) * pageCount, //查询位置
				limit: 2, //查询个数
			}, function(err, data) {
				console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.find', '参数：' + JSON.stringify(opt), 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));
				if (err) {
					console.log('err', JSON.stringify(err));
					return next(err);
				}
				return cb(null, data);
			});
		}

	}, function(err, data) {
		res.render('index', {
			title: 'index',
			data: data.list,
			page: {
				total: data.count, //总数
				page: page,
				pageCount: pageCount
			}
		});
	});

});


router.search = function(req, res, next) {
	var params = helper.getRequestParams(req);
	var key = params.key;
	// 根据空格和逗号匹配标题
	var opt = {
		title: new RegExp(key.replace(/\s+|\,/g,'|'),'ig')
	};
	PostModel.find(opt, null, {
		sort: {
			'_id': -1
		}
	}, function(err, data) {
		console.log('info', '访问路由：' + req.originalUrl, 'method：' + req.method, '方法：PostModel.find', '参数：' + opt, 'err：' + JSON.stringify(err), 'data：' + JSON.stringify(data));
		if (err) {
			console.log('err', JSON.stringify(err));
			return next(err);
		}
		res.render('search', {
			title: 'search',
			data: data,
		});
	});
};


module.exports = router;