const { Types } = require('mongoose');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
module.exports = {
	getCurrentWallet: async (userId) => {
		const UserAddCoins = await Order.aggregate([
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

		const UserUsageCoins = await Order.aggregate([
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

		return UserAddCoins + UserUsageCoins;
	},
};
