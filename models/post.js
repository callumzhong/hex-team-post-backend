const mongoose = require('mongoose');
const PostConn = require('../connections/postConn');

const PostSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, '姓名未填寫'],
		},
		tags: [
			{
				type: String,
				required: [true, '標籤 tags 未填寫'],
			},
		],
		type: {
			type: String,
			enum: ['group', 'person'],
			required: [true, '類型 type 未填寫'],
		},
		image: {
			type: String,
			default: '',
		},
		createdAt: {
			type: Date,
			default: Date.now,
			select: false,
		},
		content: {
			type: String,
			required: [true, 'Content 未填寫'],
		},
		likes: {
			type: Number,
			default: 0,
		},
		comments: {
			type: Number,
			default: 0,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

const Post = PostConn.model('Post', PostSchema);

module.exports = Post;
