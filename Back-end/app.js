const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const cors = require('cors')
const logger = require('log4js').getLogger();
require('express-async-errors');

logger.level = "info";
const app = express();

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    msg: 'hello from nodejs express api'
  });
})

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));

var verifyAccessToken = require('./models/auth.model').verifyAccessToken;

app.use('/api/bangphi', verifyAccessToken, require('./routes/bangphi.route'));
app.use('/api/khachhang', verifyAccessToken, require('./routes/khachhang.route'));
app.use('/api/lichsuchuyenkhoan', verifyAccessToken, require('./routes/lichsuchuyenkhoan.route'));
app.use('/api/lichsunhantien', verifyAccessToken, require('./routes/lichsunhantien.route'));
app.use('/api/nhacno', verifyAccessToken, require('./routes/nhacno.route'));
app.use('/api/nhacnotest', require('./routes/nhacno.route'));
app.use('/api/taikhoannganhang', verifyAccessToken, require('./routes/taikhoannganhang.route'));
app.use('/api/thietlapnguoinhan', verifyAccessToken, require('./routes/thietlapnguoinhan.route'));
app.use('/api/chuyenkhoan', require('./routes/chuyenkhoan.route'));
app.use('/api/nhacNoAddedEvent', verifyAccessToken, require('./routes/eventNhacNo').subscribeNhacNoAdded);

app.use((req, res, next) => {
  throw createError(404, 'Resource not found.');
})

app.use(function (err, req, res, next) {
  if (typeof err.status === 'undefined' || err.status === 500) {
    console.error(err.stack);
    res.status(500).send('View error log on console.');
  } else {
    res.status(err.status).send(err);
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API is running at http://localhost:${PORT}`);
})