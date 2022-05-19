'use strict';
require('dotenv').config({
	path: './config.env',
});

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/userRoute');
const uploadRouter = require('./routes/upload');
const followRouter = require('./routes/follow');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/postRoute');
const sendEmailRouter = require('./routes/send-email');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/follow', followRouter);
app.use('/api/send_email', sendEmailRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 404 錯誤
app.use(function(req, res, next) {
	res.status(404).json({
	  status: 'error',
	  message: "無此路由資訊",
	});
  });
  
  // express 錯誤處理
  // 自己設定的 err 錯誤 
  const resErrorProd = (err, res) => {
	if (err.isOperational) {
	  res.status(err.statusCode).json({
		message: err.message
	  });
	} else {
	  // log 紀錄
	  console.error('出現重大錯誤', err);
	  // 送出罐頭預設訊息
	  res.status(500).json({
		status: 'error',
		message: '系統錯誤，請恰系統管理員'
	  });
	}
  };
  // 開發環境錯誤
  const resErrorDev = (err, res) => {
	res.status(err.statusCode).json({
	  message: err.message,
	  error: err,
	  stack: err.stack
	});
  };
  // 錯誤處理
  app.use(function(err, req, res, next) {
	// dev
	err.statusCode = err.statusCode || 500;
	if (process.env.NODE_ENV === 'dev') {
	  return resErrorDev(err, res);
	} 
	// production
	if (err.name === 'ValidationError'){
	  err.message = "資料欄位未填寫正確，請重新輸入！"
	  err.isOperational = true;
	  return resErrorProd(err, res)
	}
	resErrorProd(err, res)
  });
  
  // 未捕捉到的 catch 
  process.on('unhandledRejection', (err, promise) => {
	console.error('未捕捉到的 rejection：', promise, '原因：', err);
  });
module.exports = app;
