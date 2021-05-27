const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter({
  '/api/*': '/$1',
});
server.use(rewriter);
server.use(middlewares);
server.get('/echo', (req, res) => {
  res.jsonp({
    test: '123',
  });
});
router.render = (req, res) => {
  res.jsonp({
    errno: 0,
    data: {
      list: res.locals.data,
      count: res.locals.data.length,
    },
  });
};
server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running');
});
