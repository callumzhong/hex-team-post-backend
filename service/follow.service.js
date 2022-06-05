const Users = require('../models/users.model');

module.exports = {
	getAll: async (id) => {
		//取得所有追蹤
		return await await Users.find({ _id: id }).populate({
			path: 'following',
			select: 'name _id',
		});
	},
	created: async (req) => {
		//加入追蹤
		const { followuser } = req.body;
		await Users.updateOne(
			{
				_id: req.user.id,
				following: { $ne: [followuser] },
			},
			{
				$addToSet: { following: followuser },
			},
		);
		await Users.updateOne(
			{
				_id: followuser,
				followers: { $ne: [req.user.id] },
			},
			{
				$addToSet: { followers: req.user.id },
			},
		);
		return { message: '您已成功追蹤！' };
	},
	delete: async (req) => {
		const userID = req.params.followuser;
		await Users.updateOne(
			{
				_id: req.user.id,
				following: { $in: [userID] },
			},
			{
				$pull: { following: userID },
			},
		);
		await Users.updateOne(
			{
				_id: userID,
				followers: { $in: [req.user.id] },
			},
			{
				$pull: { followers: req.user.id },
			},
		);
		return { message: '您已成功取消追蹤！' };
	},
	getUserFollowCount: async (user) => {
		//取得某個人的追蹤數
		const data = await Users.find({ _id: user }).populate('followers');
		if (data && data.length !== 0) {
			return data[0].followers?.length ?? 0;
		} else return 0;
	},
};
