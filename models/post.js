var mongoose = require('./connect_mongodb');

var PostSchema = new mongoose.Schema({
	ObjectId: mongoose.Schema.ObjectId,
    title:String,//标题
    author:String,//作者
    article:String,//文章内容
    creatTime:String,//发表时间
});

//这里会数据库会创建一个users集合
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;