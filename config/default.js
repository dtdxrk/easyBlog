module.exports = {
  port: 2999,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://0.0.0.0:27017/myblog'
};