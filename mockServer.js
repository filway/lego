const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const SECRET_KEY = '123456789';
const expiresIn = '1h';
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
const rewriter = jsonServer.rewriter({
  '/api/*': '/$1',
});
server.use(bodyParser.json());
server.use(rewriter);
server.use(middlewares);
server.post('/users/loginByPhoneNumber', (req, res) => {
  const { phoneNumber, veriCode } = req.body;
  const accessToken = createToken({ phoneNumber, veriCode });
  res.status(200).json({ data: { token: accessToken } });
});
server.use('/works', (req, res, next) => {
  const errorResp = {
    errno: 12001,
    message: '登录校验失败',
  };
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    res.json(errorResp);
    return;
  }
  try {
    verifyToken(authHeader.split(' ')[1]);
    next();
  } catch (e) {
    res.json(errorResp);
  }
});
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
