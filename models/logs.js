const mongoose = require('mongoose');
const LogsConn = require('../connections/logs.connection');

const logSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
			cast: false,
		},
		type: {
			type: String,
			required: true,
			cast: false,
		},
		method: {
			type: String,
			required: true,
			cast: false,
		},
		message: {
			type: String,
			required: true,
			cast: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	},
);
const Log = LogsConn.model('Logs', logSchema);

module.exports = Log;
