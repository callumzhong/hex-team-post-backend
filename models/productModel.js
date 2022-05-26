const mongoose = require('mongoose');
const PostConn = require('../connections/postConn');
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, '請輸入品名'],
		},
		originalPrice: {
			type: Number,
			required: [true, '請輸入原價'],
		},
		specialPrice: {
			type: Number,
			required: [true, '請輸入優惠價'],
			default: 0,
		},
		tag: {
			type: String,
			required: [true, '請輸入品項標註'],
		},
	},
	{
		versionKey: false,
	},
);
const Product = PostConn.model('product', productSchema);
module.exports = Product;
