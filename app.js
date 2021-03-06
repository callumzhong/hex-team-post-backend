'use strict';
require('dotenv').config({
	path: './config.env',
});

const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const options = require('./swagger-options');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/user.route');
const uploadRouter = require('./routes/upload.route');
const followRouter = require('./routes/follow.route');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post.route');
const commendRouter = require('./routes/comment.route');
const emailRouter = require('./routes/email.route');
const paymentRouter = require('./routes/payment.route');
const productRouter = require('./routes/products.route');
const walletRouter = require('./routes/wallet.route');
const orderRouter = require('./routes/order.route');
const newebpayRouter = require('./routes/newebpay.route');
const app = express();

expressJSDocSwagger(app)(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/newebpay', newebpayRouter);
app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);
app.use('/api/comment', commendRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/follow', followRouter);
app.use('/api/email', emailRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/order', orderRouter);

// 404 錯誤
app.use(function (req, res, next) {
	res.status(404).json({
		status: 'error',
		message: '無此路由資訊',
	});
});

// express 錯誤處理
// 自己設定的 err 錯誤
const resErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	} else {
		// log 紀錄
		console.error('出現重大錯誤', err);
		// 送出罐頭預設訊息
		res.status(500).json({
			status: 'error',
			message: '系統錯誤，請恰系統管理員',
		});
	}
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		message: err.message,
		error: err,
		stack: err.stack,
	});
};
// 錯誤處理
app.use(function (err, req, res, next) {
	// dev
	err.statusCode = err.statusCode || 500;
	if (process.env.NODE_ENV === 'dev') {
		return resErrorDev(err, res);
	}
	// production
	if (err.name === 'ValidationError') {
		err.message = '資料欄位未填寫正確，請重新輸入！';
		err.isOperational = true;
		return resErrorProd(err, res);
	}
	resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
	console.error('未捕捉到的 rejection：', promise, '原因：', err);
});
module.exports = app;
