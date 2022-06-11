const Post = require('../models/posts.model');
const Order = require('../models/order.model');
const User = require('../models/users.model');
const { default: mongoose } = require('mongoose');

const calculatePagination = async (query, pageSize = 10, page = 1) => {
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

	result.current_page = page > totalPages ? totalPages : page;
	result.total_pages = totalPages;
	result.has_pre = result.current_page > 1 ? true : false;
	result.has_next = result.current_page >= totalPages ? false : true;

	return result;
};

const getBoughtOrder = async (userId) => {
	const toDay = new Date().toISOString();
	return await Order.find({
		user: userId,
		type: {$in: ['SINGLE_POST', 'SUBSCRIPTION_POST']},
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
const getBoughtInverseUser = async(userid)=>{
	const inverseUser= await Order.find({
		user:userid,
		type: {$in: [ 'SUBSCRIPTION_POST']},
		effectiveOfEnd :{$gte:new Date()}		
	});
	let iuser=[];
	inverseUser.forEach(element => {
		iuser.push(element.inverseUser);
	});
	const postdata= await Post.find({user:{$in:iuser},type:'person'}).select('_id');
	return postdata;
}

const getBoughtPostId= async(user)=>{
	return await Order.find({
		user,
		type: {$in: ['SINGLE_POST']}		
	}).select('post');
}

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
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];

		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.sort({ createdAt: sort })
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.skip((page - 1) * pageSize)
				.limit(pageSize);
		}

		return { data, Pagination };
	},
	getPaginationData: async (req) => {
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

		let pagination = {};
		const count = await Post.find(query).count();
		pagination['total_pages'] = count;
		pagination['current_page'] = page;
		pagination['has_pre'] = page == 1 ? false : page < count;
		pagination['has_next'] = page == count ? false : page < count;
		return pagination;
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
			user: {$ne: req.user.id,},
			type: { $in: ['person'] },
		};
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		if (like !== undefined) query['likes'] = { $in: [like] };

		const boughtUser=await getBoughtInverseUser(req.user.id);
		const boughtPost=await getBoughtPostId(req.user.id);
		let postid=[];
		boughtUser.forEach((i)=>{
			postid.push(i._id);
		})
		boughtPost.forEach((i)=>{
			postid.push(i.post._id);
		})
		//query['user']={$in:boughtUser};
		query['_id']={$in:postid};

		// const bought = await getBoughtOrder(req.user.id);
		// const filterBought = {
		// 	$or: [],
		// };

		// if (bought.some((i) => i.userId.trim())) {
		// 	filterBought.$or.push({
		// 		user: {
		// 			$in: bought
		// 				.filter((buy) => buy.userId.trim())
		// 				.map((item) => item.userId),
		// 		},
		// 	});
		// }

		// if (bought.some((i) => i.postId.trim())) {
		// 	filterBought.$or.push({
		// 		id: {
		// 			$in: bought
		// 				.filter((buy) => buy.postId.trim())
		// 				.map((item) => item.postId),
		// 		},
		// 	});
		// }
		
		const pageSize = 10;
		const pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		const filter = [];
		let data = [];
		if (pagination.total_pages > 0 ) {
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
						post.isLocked = true;
						return post;
					});
				});
				;
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
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.sort({ createdAt: sort })
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.skip((page - 1) * pageSize)
				.limit(pageSize);
		}
		return { data, Pagination };
	},
	getAll: async () => {},
	getUserAll: async (req) => {
		const user = req.params.Userid;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { user, type: { $in: ['group'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}

		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'comments',
					select: 'comment user',
				})
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt: sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize);
		}
		return { data, Pagination };
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
					post.isLocked = true;
					return post;
				}
				post.isLocked = false;
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
				pay:req.body.pay
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
		return await Post.find({ user, type: 'group' }).count();
	},
	getPostCountbyPerson: async (user) => {
		//取得個人貼文
		return await Post.find({ user, type: 'person' }).count();
	},
	getPostLikeCount: async (user) => {
		//取得某個人的like數
		//const data =await Post.find({user});
		const data = await Post.aggregate([
			{ $match: { user: mongoose.Types.ObjectId(user) } },
			{ $group: { _id: '$user', likeslength: { $sum: { $size: '$likes' } } } },
			//,{$group:{_id:'$user','totalsum':{$sum:'$likeSize'}}}
			//,{$sort:{totalsum:-1}}
		]);
		if (data.length > 0) {
			return data[0].likeslength;
		} else return 0;
	},
	//私密 綁登入者確認是否購買
	getPrivatebyUserID: async (req) => {
		//取得個人貼文
		let user = req.user?.id;
		// if (user == undefined) user = req.params.id;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { user, type: { $in: ['person'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		// 取個人不必取得購買訂單匹配
		// const bought = await getBoughtOrder(user);
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt:sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.then((posts) => {
					return posts.map((post) => {
						post.isLocked = false;
						return post;
					});
				});
		}
		// posts.forEach(post=>{
		// 	post.image=process.env.mockimage;
		// });
		return { data, Pagination };
	},
	//私密 公開權模糊
	getPrivateforUser: async (req) => {
		const user = req.params.id;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { user, type: { $in: ['person'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		//const bought = await getBoughtOrder(user);
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt: sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.then((posts) => {
					return posts.map((post) => {
						post.isLocked = true;
						post.image = process.env.mockimage;
						return post;
					});
				});
		}
		// posts.forEach(post=>{
		// 	post.image=process.env.mockimage;
		// });
		return { data, Pagination };
	},
	//私密 綁登入者確認是否購買
	getPrivateforAuthUser: async (req) => {
		const user = req.user.id;
		const puser = req.params.id;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { user: puser, type: { $in: ['person'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		const bought = await getBoughtOrder(user);
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt: sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize)				
				.then((posts) => {
					return posts.map((post) => {
						if (
							bought.findIndex(
								(i) => i.postId=== post.id || i.userId === post.user.id,
							) !== -1
						) {
							post.isLocked = false;
							return post;
						}
						post.isLocked = true;
						post.image = process.env.mockimage;
						return post;
					});
				});
		}

		return { data, Pagination };
	},
	getOrderlikes: async (req) => {
		//const orderlikes = await Post.find({"$where":"this.likes.length>0"});
		const orderlikes = await Post.aggregate([
			{
				$project: {
					user: 1,
					image: 1,
					content: 1,

					likeSize: { $size: '$likes' },
				},
			},
			{
				$match: {
					likeSize: { $gt: 0 },
				},
			},
			{
				$sort: { likeSize: -1 },
			},
			{ $limit: 10 },
		]);
		await Post.populate(orderlikes, { path: 'user', select: 'name photo' });
		return orderlikes;
	},
	getOrderUsers: async (req) => {
		//const orderlikes = await Post.find({"$where":"this.likes.length>0"});
		const orderlikes = await Post.aggregate([
			{
				$project: {
					user: 1,
					likeSize: { $size: '$likes' },
				},
			},
			{ $match: { likeSize: { $gt: 0 } } },
			{ $group: { _id: '$user', totalsum: { $sum: '$likeSize' } } },
			{ $sort: { totalsum: -1 } },
			{ $limit: 10 },
		]);

		await Post.populate(orderlikes, { path: '_id', model: 'user' });
		return orderlikes;
	},
	getfollowPost: async (query, req) => {
		//追蹤者貼文
		let page = req.query.page;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;

		const user = req.user.id; // 登入者id
		const bought = await getBoughtOrder(user);
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt: sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.then((posts) => {
					return posts.map((post) => {
						if (post.type === 'person') {
							if (
								bought.findIndex(
									(i) => i.postId === post.id || i.userId === post.user.id,
								) !== -1
							) {
								post.isLocked = false;
								return post;
							}
							post.isLocked = true;
							post.image = process.env.mockimage;
							return post;
						} else {
							return post;
						}
					});
				});
		}
		return { data, Pagination };
	},
	getUserLikes: async (req) => {
		const user=req.user.id;
		let page = req.query.page;
		let search = req.query.q;
		let sort = req.query.sort;

		if (page == undefined) page = 1;
		if (sort == undefined) sort = -1;
		else sort = sort == 'asc' ? 1 : -1;
		if (search == undefined) search = '';

		let query = { likes: {$in:user}, type: { $in: ['group'] } };
		if (search !== '') {
			query['content'] = { $regex: search };
		}
		const pageSize = 10;
		const Pagination = await calculatePagination(
			query,
			pageSize,
			parseInt(page),
		);
		let data = [];
		if (Pagination.total_pages > 0) {
			data = await Post.find(query)
				.populate({
					path: 'user',
					select: 'name photo gender',
				})
				.sort({ createdAt:sort })
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.then((posts) => {
					return posts.map((post) => {
						post.isLocked = false;
						return post;
					});
				});
		}
		
		return { data, Pagination };
	}
};
