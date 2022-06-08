const Order = require('../models/order.model');

module.exports = {
	getSubscribedUsers: async (user) => {
		const order = await Order.find({
			user: user.id,
			effectiveOfStart: {
				$lt: new Date().toISOString(),
			},
			effectiveOfEnd: {
				$gte: new Date().toISOString(),
			},
		}).then((orders) => {
			return orders.map((order) => ({
				id: order.inverseUser.id,
				name: order.inverseUser.name,
			}));
		});

		return order;
	},
};
