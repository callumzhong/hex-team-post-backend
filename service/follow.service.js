const Post = require('../models/posts.model');
const Users = require('../models/users.model');
const postService = require('./post.service');

module.exports = {
	getAll: async (id) => {
		//取得所有追蹤
		return await await Users.find({ _id: id }).populate({
			path: 'following'
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
		if (data && data?.length !== 0) {
			return data[0].followers?.length ?? 0;
		} else return 0;
	},
	getUserFollowOrder: async() => {
		//取得某個人的追蹤數
		//const orderfollowers = await Users.find().populate('followers');
		const orderfollowers = await Users.aggregate([{
			$project :{
				name:1
				,photo:1
				,followers:1
				,followersSize:{$size:"$followers"}}
			},{
					$match:{
						followersSize:{$gt:0}
					}
				},{
					$sort:{followersSize:-1}
				}
		]).limit(10);
		return orderfollowers;
	},
	getUserFollowPosts:async(req)=>{
		//取得追蹤者貼文calculatePagination
		const id=req.user.id;		
		
		const userdata = await Users.find({_id: id}).select('following')
		;
		let data = [];

		if(userdata.length>0){
			let search = req.query.q;
			if (search == undefined) search = '';

			let query = { user:{$in:userdata[0].following} }; //, type: { $in: ['group'] }
			if (search !== '') {
				query['content'] = { $regex: search };
			}
		
			return await postService.getfollowPost(query,req);
		}else {
			return {message:'沒有追蹤者。'};
		}
		//const postdata=await Post.find();
		
	}
};
