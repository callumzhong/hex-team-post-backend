const mongoose = require('mongoose');
const PostConn = require('../connections/post.connection');
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, '請輸入品名'],
		},
		coin: {
			type: Number,
			required: [true, '請輸入代幣'],
			unique: true,
		},
		price: {
			type: Number,
			required: [true, '請輸入價錢'],
		},
		discount: {
			type: Number,
			required: [true, '請輸入折扣'],
			default: 0,
		},
		tag: {
			type: String,
			default: '',
		},
	},
	{
		versionKey: false,
	},
);
const Product = PostConn.model('product', productSchema);
module.exports = Product;
