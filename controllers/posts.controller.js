const { appError, Success, SuccessPagination } = require('../service/appError');
const ErrorHandler = require('../service/errorHandler');
const postService = require('../service/post.service');
module.exports = {
	getPagination: async (req, res, next) => {
		try {
			const Post = await postService.getPagination(req);
			const PostPagination =await postService.getPaginationData(req);
			if (Post) {
				//Success(res, Post);
				SuccessPagination(res,Post,PostPagination);
			} else {
				return ErrorHandler(new Error('取得文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getPaginationBynormal: async (req, res, next) => {
		try {
			const Post = await postService.getPaginationbynormal(req);
			if (Post) {
				Success(res, Post);
			} else {
				return ErrorHandler(new Error('取得文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getOne: async (req, res, next) => {
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "取得單筆資料" } */
		try {
			if (req.params.id == undefined) {
				return ErrorHandler(new Error('文章id有誤'), req, res, next);
			}
			const Post = await postService.getOne(req);
			if (Post) {
				Success(res, Post);
			} else {
				return ErrorHandler(new Error('取得文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getUserAll: async (req, res, next) => {
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "取得使用者前10筆資料" } */
		try {
			const userid = req.params.Userid;
			if (userid == undefined) {
				return ErrorHandler(new Error('userid有誤'), req, res, next);
			}
			const Post = await postService.getUserAll(req);
			if (Post) {
				Success(res, Post);
			} else {
				return ErrorHandler(new Error('取得文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	created: async (req, res, next) => {
		try {
			const { content, contentType, image } = req.body;
			if (content == undefined || image == undefined) {
				return next(appError(400, '你沒有填寫 content or image 資料', next));
			}
			if (contentType == undefined) {
				return next(appError(400, '你沒有填寫 contentType 資料', next));
			}
			const newPost = await postService.AddPost(req);
			Success(res, newPost);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	createdPrivate: async (req, res, next) => {
		try {
			const { content, image, pay, contentType } = req.body;
			if (content == undefined || image == undefined) {
				return next(appError(400, '你沒有填寫 content 或 image 資料', next));
			}
			if (contentType == undefined) {
				return next(appError(400, '你沒有填寫 contentType 資料', next));
			}
			if (pay == undefined) {
				return next(appError(400, '售價未填寫', next));
			}
			const newPost = await postService.addPrivatePost(req);
			Success(res, newPost);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	createdlike: async (req, res, next) => {
		try {
			const userid = req.params.id;
			if (userid == undefined) {
				return ErrorHandler(new Error('Post Id有誤'), req, res, next);
			}
			const newPost = await postService.Addlike(req);
			Success(res, newPost);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	unlike: async (req, res, next) => {
		try {
			const userid = req.params.id;
			if (userid == undefined) {
				return ErrorHandler(new Error('Post Id有誤'), req, res, next);
			}
			const newPost = await postService.unlike(req);
			Success(res, newPost);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getPrivatebyAuth: async (req, res, next) => {
		try {
			let user = req.user.id;

			const Post = await postService.getPrivatebyUserID(user);
			if (Post) {
				Success(res, Post);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	getPrivatebyUserID: async (req, res, next) => {
		try {
			let user = req.params.id;

			const Post = await postService.getPrivatebyUserID(user);
			if (Post) {
				Success(res, Post);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	updated: async (req, res, next) => {
		try {
			const { content, contentType } = req.body;
			if (content == undefined) {
				return next(appError(400, '你沒有填寫 content 資料', next));
			}
			if (contentType == undefined) {
				return next(appError(400, '你沒有填寫 contentType 資料', next));
			}
			if (req.params.id == undefined) {
				return ErrorHandler(new Error('文章id有誤'), req, res, next);
			}
			const Post = await postService.updated(req);
			if (Post) {
				Success(res, Post);
			} else {
				return ErrorHandler(new Error('更新文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	deleteAll: async (req, res, next) => {
		try {
			const delPost = await postService.deleteAll(req);
			if (delPost.deletedCount > 0) {
				Success(res, { message: '刪除全部文章成功!' });
			} else {
				ErrorHandler(new Error('刪除文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},

	deleteOne: async (req, res, next) => {
		/* #swagger.responses[200] = {
				description: "刪除成功" 
		} */
		/* #swagger.responses[404] = {
				schema:"查無貼文",
				description: "刪除失敗" 
		}*/
		try {
			if (req.params.id == undefined) {
				return ErrorHandler(new Error('文章id有誤'), req, res, next);
			}
			const delPost = await postService.deleteOne(req);
			if (delPost.deletedCount > 0) {
				Success(res, { message: '刪除文章成功!' });
			} else {
				return ErrorHandler(new Error('刪除文章失敗'), req, res, next);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
};
