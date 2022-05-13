'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
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
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
