const { Types } = require('mongoose');
const Order = require('../models/order.model');
module.exports = {
	getCurrentWallet: async (userId) => {
		const userAddCoins = await Order.aggregate([
			{
				$lookup: {
					from: 'payments',
					localField: 'payment',
					foreignField: '_id',
					as: 'payment',
				},
			},
			{
				$match: {
					user: Types.ObjectId(userId),
					type: 'ADD_CREDIT',
					'payment.status': true,
				},
			},
			{
				$group: {
					_id: '$type',
					totalAddCoin: { $sum: '$addCoin' },
				},
			},
		]).then((data) => data.reduce((prev, curr) => prev + curr.totalAddCoin, 0));

		const userUsageCoins = await Order.aggregate([
			{
				$match: {
					user: Types.ObjectId(userId),
					type: {
						$ne: 'ADD_CREDIT',
					},
				},
			},
			{
				$group: {
					_id: '$type',
					totalAddCoin: { $sum: '$addCoin' },
					totalReduceCoin: { $sum: '$reduceCoin' },
				},
			},
		]).then((data) =>
			data.reduce(
				(prev, curr) => prev + curr.totalAddCoin - curr.totalReduceCoin,
				0,
			),
		);

		return userAddCoins + userUsageCoins;
	},
	getAddCreditRecord: async (userId) => {
		const records = await Order.find({
			user: userId,
			type: 'ADD_CREDIT',
		})
			.populate({
				path: 'payment',
				select: 'status message merchantOrderNo',
			})
			.then((documents) => {
				return documents.map((document) => ({
					summary: document.summary,
					createdAt: document.createdAt,
					status: document.payment.status,
					amountNTD: document.product.price - document.product.discount,
					amountCoin: document.addCoin,
					serialNumber: document.serialNumber,
				}));
			});
		return records;
	},
	getPayRecord: async (userId) => {
		const records = await Order.find({
			user: userId,
			type: {
				$in: ['SINGLE_POST', 'SUBSCRIPTION_POST'],
			},
		}).then((documents) => {
			return documents.map((document) => ({
				summary: document.summary,
				postId: document.post,
				createdAt: document.createdAt,
				status: true,
				name: document.inverseUser.name,
				amountCoin: document.reduceCoin,
				serialNumber: document.serialNumber,
			}));
		});
		return records;
	},
	getIncomeRecord: async (userId) => {
		const records = await Order.find({
			user: userId,
			type: {
				$in: ['INCOME'],
			},
		}).then((documents) => {
			return documents.map((document) => ({
				summary: document.summary,
				postId: document.post,
				createdAt: document.createdAt,
				status: true,
				name: document.inverseUser.name,
				amountCoin: document.addCoin,
				serialNumber: document.serialNumber,
			}));
		});
		return records;
	},
};
