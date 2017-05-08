var index = require('./index');
var users = require('./users');
var reg = require('./reg');
var login = require('./login');
var post = require('./post');

//检测是否登录
function checkLogin(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/');
	}
	next();
}


module.exports = function(app) {
	app.use('/', index);
	// app.use('/users',users);
	app.use('/reg', reg);
	app.use('/login', login);
	app.use('/post', checkLogin, post);
	app.use('/search', index.search);
};;