const Post = require('../models/posts.model');

module.exports = {
	getPagination: async (req) => {
		const user=req.user.id;
		let page=req.query.page;
		let search=req.query.q;
		let sort=req.query.sort;
		let like=req.query.like;
		
		if(page == undefined) page = 1;
		if(sort == undefined) sort = -1;
		else sort=(sort=='asc')?1:-1;
		if(search == undefined) search = '';
		
		let query={user};
		if(search !== '') {
			query['content']={$regex: search};
		}
		if(like !== undefined)
			query['likes']={$in: [like]};

		const data = await Post.find(query).sort({createdAt:sort})
			.populate({
				path: 'user',
				select: 'name photo gender'
			}).skip((page-1) * 10).limit(10);	
		
		return data;
	},
	getAll: async () => {},
	getUserAll: async (req) => {
		const user=req.params.Userid;
		return await Post.find({user}).populate({
			path: 'comments',
			select: 'comment user'
		  }).sort({createdAt:-1}).limit(10);
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
			contentType: req.body.contentType,
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
			contentType:req.body.contentType,
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
			contentType:req.body.contentType,
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
			content: req.body.content,
			contentType:req.body.contentType			
		},{new:true});
		return updPost;
	},
	deleteAll: async (req) => {
		return await Post.deleteMany({user:req.user.id});
	},
	deleteOne: async (req) => {
		return await Post.deleteMany({user:req.user.id,_id:req.params.id});
	},
	getPostCountbyGroup: async(user)=>{
		//取得個人貼文
		return await Post.find({user,type:'group'}).count();
	},
	getPostCountbyPerson: async(user)=>{
		//取得個人貼文
		return await Post.find({user,type:'person'}).count();
	}
};
