const mongoose = require('mongoose');
const PASSWORD = process.env.DATABASE_LOGS_PASSWORD;
const DATABASE =
	process.env.DATABASE_LOGS?.replace('<password>', PASSWORD) ?? '';
const LogsConn = mongoose.createConnection(DATABASE);

module.exports = LogsConn;
