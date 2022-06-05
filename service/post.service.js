const Post = require('../models/posts.model');
const Order = require('../models/order.model');

const calculatePagination = async (query, pageSize = 10) => {
	const postCount = await Post.find(query).count();
	const totalPages = Math.ceil(postCount / pageSize);
	const result = {
		current_page: 0,
		total_pages: 0,
		has_pre: false,
		has_next: false,
	};
	if (postCount === 0) {
		return result;
	}

	result.current_page = query.page > totalPages ? totalPages : query.page;
	result.total_pages = totalPages;
	result.has_pre = result.current_page > 1 ? true : false;
	result.has_next = result.current_page >= totalPages ? false : true;

	return result;
};

const getBoughtOrder = async (userId) => {
	const toDay = new Date().toISOString();
	return await Order.find({
		user: userId,
		type: {
			$in: ['SINGLE_POST', 'SUBSCRIPTION_POST'],
		},
	}).then((items) => {
		return items.map((item) => ({
			userId:
				toDay <= new Date(item.effectiveOfEnd).toISOString()
					? item.inverseUser.id
					: '',
			postId: item?.post?.toString() ?? '',
		}));
	});
};

module.exports = {
	getPagination: async (req) => {
		const user = req.user.id;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;
		let like = req.query.like;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { user, type: { $in: ['group'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		if (like !== undefined) query['likes'] = { $in: [like] };

		const data = await Post.find(query)
			.sort({ createdAt: sort })
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.skip((page - 1) * 10)
			.limit(10);

		return data;
	},
	getPaginationByDiary: async (req) => {
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;
		let like = req.query.like;
		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = {
			user: {
				$ne: req.user.id,
			},
			type: { $in: ['person'] },
		};
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		if (like !== undefined) query['likes'] = { $in: [like] };

		const bought = await getBoughtOrder(req.user.id);

		const pageSize = 10;
		const pagination = await calculatePagination(query, pageSize);
		let data = [];

		if (pagination.total_pages > 0) {
			data = await Post.find(query)
				.sort({ createdAt: sort })
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.then((posts) => {
					return posts.map((post) => {
						if (
							bought.findIndex(
								(i) => i.postId === post.id || i.userId === post.user.id,
							) !== -1
						) {
							return post;
						}
						post.image = process.env.mockimage;
						return post;
					});
				});
		}

		return {
			data,
			paging: pagination,
		};
	},
	getPaginationbynormal: async (req) => {
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;
		let like = req.query.like;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { type: { $in: ['group'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		if (like !== undefined) query['likes'] = { $in: [like] };

		const data = await Post.find(query)
			.sort({ createdAt: sort })
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.skip((page - 1) * 10)
			.limit(10);

		return data;
	},
	getAll: async () => {},
	getUserAll: async (req) => {
		const user = req.params.Userid;
		return await Post.find({ user, type: { $in: ['group'] } })
			.populate({
				path: 'comments',
				select: 'comment user',
			})
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.sort({ createdAt: -1 })
			.limit(10);
	},
	getOne: async (req) => {
		return await Post.findOne({ _id: req.params.id })
			.populate({
				path: 'comments',
				select: 'comment user',
			})
			.populate({
				path: 'user',
				select: 'name photo gender',
			});
	},
	getOneByHasSignIn: async (req) => {
		const { id: userId } = req.user;
		const bought = await getBoughtOrder(req.user.id);
		return await Post.findOne({ _id: req.params.id })
			.populate({
				path: 'comments',
				select: 'comment user',
			})
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.then((post) => {
				if (
					post.user.id !== userId &&
					post.type === 'person' &&
					bought.findIndex(
						(i) => i.postId === post.id || i.userId === post.user.id,
					) === -1
				) {
					post.image = process.env.mockimage;
				}
				return post;
			});
	},
	created: async (req) => {
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: req.body.type,
			image: req.body.image,
			contentType: req.body.contentType,
			content: req.body.content,
			likes: req.body.likes,
			comments: req.body.comments,
		});
		return newPost;
	},
	//新增個人
	AddPost: async (req) => {
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: 'group', //公開
			contentType: req.body.contentType,
			image: req.body.image,
			content: req.body.content,
			pay: 0,
		});
		return newPost;
	},
	//新增like
	Addlike: async (req) => {
		const updPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ $addToSet: { likes: req.user.id } },
			{ new: true },
		);

		return updPost;
	},
	//刪除like
	unlike: async (req) => {
		const updPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ $pull: { likes: req.user.id } },
			{ new: true },
		);
		return updPost;
	},
	//新增私密
	addPrivatePost: async (req) => {
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: 'person', //公開
			contentType: req.body.contentType,
			image: req.body.image,
			content: req.body.content,
			pay: req.body.pay,
		});
		return newPost;
	},
	updated: async (req) => {
		const updPost = await Post.findByIdAndUpdate(
			req.params.id,
			{
				tags: req.body.tags,
				image: req.body.image,
				content: req.body.content,
				contentType: req.body.contentType,
			},
			{ new: true },
		);
		const newpost = await Post.find({ _id: req.params.id })
			.sort({ createdAt: -1 })
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.limit(10);
		return newpost;
	},
	deleteAll: async (req) => {
		return await Post.deleteMany({ user: req.user.id });
	},
	deleteOne: async (req) => {
		return await Post.deleteMany({ user: req.user.id, _id: req.params.id });
	},
	getPostCountbyGroup: async (user) => {
		//取得個人貼文
		return await Post.find({ user, type: { $in: ['group'] } }).count();
	},
	getPostCountbyPerson: async (user) => {
		//取得個人貼文
		return await Post.find({ user, type: { $in: ['person'] } }).count();
	},
	getPostLikeCount: async (user) => {
		//取得某個人的like數
		const data = await Post.find({ user }).populate('likes');
		if (data) {
			return data[0].followers.length;

		} else return 0;
	},
	getPrivatebyUserID: async (user) => {
		//取得個人貼文
		const posts = await Post.find({ user, type: { $in: ['person'] } })
			.populate({
				path: 'user',
				select: 'name photo gender',
			})
			.sort({ createdAt: -1 })
			.limit(10);
		// posts.forEach(post=>{
		// 	post.image=process.env.mockimage;
		// });
		return posts;
	},
};
