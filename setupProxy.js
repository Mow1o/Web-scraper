const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/news',
    createProxyMiddleware({
      target: '/news',
      changeOrigin: true,
    })
  );
};