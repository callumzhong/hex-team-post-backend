const { Success } = require('../service/appError');
const commentService = require('../service/comment.service');
const ErrorHandler = require('../service/errorHandler');

module.exports = {
	created: async (req, res, next) => {
		try {
			const { comment } = req.body;
			const PostId = req.params.PostId;
			if (PostId == undefined) {
				return ErrorHandler(new Error('文章id有誤'), req, res, next);
			}
			if (comment == undefined) {
				return ErrorHandler(new Error('留言內容有誤'), req, res, next);
			}
			const Newcomment = await commentService.created(req);
			Success(res, Newcomment);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	delete: async (req, res, next) => {
		try {
			const commentid = req.params.id;
			if (commentid == undefined) {
				return ErrorHandler(new Error('留言id有誤'), req, res, next);
			}
			const comment = await commentService.delete(commentid);
			Success(res, comment);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
};
