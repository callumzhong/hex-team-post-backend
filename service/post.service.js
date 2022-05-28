const Post = require('../models/posts.model');

module.exports = {
	getPagination: async () => {},
	getAll: async () => {},
	getUserAll: async (req) => {
		const user=req.user.id;
		return await Post.find({user}).populate({
			path: 'comments',
			select: 'comment user'
		  });
	},
	getOne: async (req) => {
		return await Post.findOne({_id:req.params.id}).populate({
			path: 'comments',
			select: 'comment user'
		  });
	},
	created: async (req) => {		
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: req.body.type,
			image: req.body.image,
			content: req.body.content,
			likes: req.body.likes,
			comments: req.body.comments
		  });
		  return newPost;
	},
	//新增個人
	AddPost:async (req)=>{
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: 'group', //公開
			image: req.body.image,
			content: req.body.content,
			pay: 0
		});
		return newPost;
	},
	//新增私密
	addPrivatePost:async(req)=>{
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,
			type: 'person', //公開
			image: req.body.image,
			content: req.body.content,
			pay: req.body.pay
		});
		return newPost;
	},
	updated: async (req) => {
		const updPost= await Post.findByIdAndUpdate(req.params.id, {			
			tags: req.body.tags,			
			image: req.body.image,
			content: req.body.content			
		},{new:true});
		return updPost;
	},
	deleteAll: async (req) => {
		return await Post.deleteMany({user:req.user.id});
	},
	deleteOne: async (req) => {
		return await Post.deleteMany({user:req.user.id,_id:req.params.id});
	},
	getPostCountbyGroup: async(req)=>{
		//取得個人貼文
		return await Post.find({user:req.user.id,type:'group'}).count();
	},
	getPostCountbyPerson: async(req)=>{
		//取得個人貼文
		return await Post.find({user:req.user.id,type:'person'}).count();
	}
};
