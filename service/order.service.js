const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Payment = require('../models/payment.model');

module.exports = {
	created: async (productId, user) => {
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
	getStatus: async (orderId) => {
		const order = await Order.findById(orderId);
		return order;
	},
};
