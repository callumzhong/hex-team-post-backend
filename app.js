'use strict';
require('dotenv').config({
	path: './config.env',
});
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const DATABASE =
	process.env.DATABASE_LOGS?.replace(
		'<password>',
		process.env.DATABASE_POST_PASSWORD,
	) ?? '';
console.log('🚀 ~ file: app.js ~ line 16 ~ DATABASE', DATABASE);
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/posts', postRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
