const mongoose = require('mongoose');
const PASSWORD = process.env.DATABASE_POST_PASSWORD;
const DATABASE =
	process.env.DATABASE_POST?.replace('<password>', PASSWORD) ?? '';
const PostConn = mongoose.createConnection(DATABASE);

module.exports = PostConn;
