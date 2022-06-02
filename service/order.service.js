const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Payment = require('../models/payment.model');
const Posts = require('../models/posts.model');
const walletService = require('./wallet.service');

const calculateSerialNumber = async () => {
	const date = new Date();
	const year = date.toLocaleString('en-US', {
		timeZone: 'asia/taipei',
		year: 'numeric',
	});
	const month = date.toLocaleString('en-US', {
		timeZone: 'asia/taipei',
		month: 'numeric',
	});
	const day = date.toLocaleString('en-US', {
		timeZone: 'asia/taipei',
		day: 'numeric',
	});

	const start = new Date(year, Number(month) - 1, day, 0, 0, 0, 0);
	const end = new Date(year, Number(month) - 1, day, 23, 59, 59, 999);

	const orderCount = await Order.find({
		createdAt: {
			$gte: start,
			$lte: end,
		},
	}).count();
	const serialNumber = [
		year,
		month.padStart(2, '0'),
		day.padStart(2, '0'),
		String(orderCount + 1).padStart(5, '0'),
	].join('');

	return serialNumber;
};

module.exports = {
	created: async (productId, user) => {
		const serialNumber = await calculateSerialNumber();
		const product = await Product.findById(productId);
		if (!product) {
			return false;
		}

		const order = await Order.create({
			user: user.id,
			product: product.id,
			type: 'ADD_CREDIT',
			summary: `購買${product.name}`,
			addCoin: product.coin,
			reduceCoin: 0,
			serialNumber: serialNumber,
		});

		return order;
	},
	createdPayPrivatePost: async (postId, user) => {
		const post = await Posts.findById(postId);
		const serialNumber = await calculateSerialNumber();

		if (!post) return '查無貼文';
		if (post.pay === 0) {
			return '貼文費用 0 請通知客服處理';
		}

		const walletAmount = await walletService.getCurrentWallet(user.id);
		if (post.pay > walletAmount) {
			return '餘額不足';
		}

		const order = await Order.create({
			user: user.id,
			inverseUser: post.user,
			post: post.id,
			serialNumber: serialNumber,
			type: 'SINGLE_POST',
			summary: `購買私密日記`,
			addCoin: 0,
			reduceCoin: post.pay,
		});
		return order;
	},
	getStatus: async (orderId) => {
		const order = await Order.findById(orderId);
		return order;
	},
};
