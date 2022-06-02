const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Payment = require('../models/payment.model');
const Posts = require('../models/posts.model');
const walletService = require('./wallet.service');
const User = require('../models/users.model');

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

	const order = await Order.findOne({
		createdAt: {
			$gte: start,
			$lte: end,
		},
	}).sort({ createdAt: -1 });
	const serialNumber = [
		year,
		month.padStart(2, '0'),
		day.padStart(2, '0'),
		!order
			? '00001'
			: String(+order.serialNumber.slice(8) + 1).padStart(5, '0'),
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
		if (!post) return '查無貼文';
		if (post.pay === 0) {
			return '貼文費用 0 請通知客服處理';
		}
		if (post.user === user.id) {
			return '無法購買自己的貼文';
		}

		const walletAmount = await walletService.getCurrentWallet(user.id);
		if (post.pay > walletAmount) {
			return '餘額不足';
		}

		let serialNumber = await calculateSerialNumber();
		await Order.create({
			user: post.user,
			inverseUser: user.id,
			post: post.id,
			serialNumber: serialNumber,
			type: 'INCOME',
			summary: `私密日記收益`,
			addCoin: post.pay,
			reduceCoin: 0,
		});

		serialNumber = await calculateSerialNumber();
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
	createdPaySubscriptionUser: async (data, user) => {
		const { subscriptionUserId, productId } = data;
		const product = await Product.findById(productId);
		const subscriptionUser = await User.findById(subscriptionUserId);
		if (product.type !== 'ticket') {
			return '產品類型錯誤';
		}
		if (subscriptionUserId === user.id) {
			return '無法訂閱自己';
		}
		if (!subscriptionUser) {
			return '被訂閱用戶不存在';
		}
		let start = new Date().toISOString().slice(0, 23) + '+08:00';
		let end = new Date();
		end.setMonth(end.getMonth() + product.effectiveOfMonthNumber);
		end = end.toISOString().slice(0, 23) + '+08:00';

		const walletAmount = await walletService.getCurrentWallet(user.id);
		if (product.coin > walletAmount) {
			return '餘額不足';
		}
		let serialNumber = await calculateSerialNumber();

		await Order.create({
			user: subscriptionUser.id,
			inverseUser: user.id,
			serialNumber: serialNumber,
			type: 'INCOME',
			summary: `訂閱收益`,
			addCoin: product.coin,
			reduceCoin: 0,
			effectiveOfStart: start,
			effectiveOfEnd: end,
		});

		serialNumber = await calculateSerialNumber();
		const order = await Order.create({
			user: user.id,
			inverseUser: subscriptionUser.id,
			serialNumber: serialNumber,
			type: 'SUBSCRIPTION_POST',
			summary: `訂閱用戶`,
			addCoin: 0,
			reduceCoin: product.coin,
			effectiveOfStart: start,
			effectiveOfEnd: end,
		});
		return order;
	},
	getStatus: async (orderId) => {
		const order = await Order.findById(orderId);
		return order;
	},
};
