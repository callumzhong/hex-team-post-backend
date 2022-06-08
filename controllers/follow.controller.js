const { Success } = require('../service/appError');
const ErrorHandler = require('../service/errorHandler');
const followService = require('../service/follow.service');

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const follow = await followService.getAll(req.user.id);
			Success(res, follow);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getOne: async (req, res, next) => {
		if (req.params.id == undefined) {
			return ErrorHandler(new Error('使用者id有誤'), req, res, next);
		}
		try {
			const follow = await followService.getAll(req.params.id);

			Success(res, follow);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	created: async (req, res, next) => {
		try {
			const { followuser } = req.body;
			if (followuser == undefined) {
				return ErrorHandler(new Error('追蹤使用者id有誤'), req, res, next);
			}
			if (followuser === req.user.id) {
				return next(errorHandle(401, '您無法追蹤自己', next));
			}
			const follow = await followService.created(req);
			Success(res, follow);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	delete: async (req, res, next) => {
		try {
			const userID = req.params.followuser;
			if (userID == undefined) {
				return ErrorHandler(new Error('追蹤使用者id有誤'), req, res, next);
			}
			if (userID === req.user.id) {
				return next(errorHandle(401, '您無法取消追蹤自己', next));
			}

			const follow = await followService.delete(req);
			Success(res, follow);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getUserFollowCount: async (req, res, next) => {
		//取得某個人的追蹤數
		try {
			if (req.params.id == undefined) {
				return ErrorHandler(new Error('使用者id有誤'), req, res, next);
			}
			const followCount = await followService.getUserFollowCount(req.params.id);
			Success(res, followCount);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getUserFollowOrder: async (req, res, next) => {
		try {
			const followOrder = await followService.getUserFollowOrder();
			Success(res, followOrder);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getUserFollowPosts: async (req, res, next) => {
		try {
			const data = await followService.getUserFollowPosts(req);
			Success(res, data);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	}
};
