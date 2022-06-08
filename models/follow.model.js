const mongoose = require('mongoose');
const PostConn = require('../connections/post.connection');

const followSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'user',
		require: ['true', '使用者必須存在'],
	},
	followuser: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'user',
		},
	],
});
followSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'followuser',
		select: 'name id photo createdAt',
	});

	next();
});

const Follow = PostConn.model('Follow', followSchema);

module.exports = Follow;
