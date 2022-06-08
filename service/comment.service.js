const Comment = require('../models/comments.model');
const Post = require('../models/posts.model');

module.exports = {
	created: async (req) => {	
        const user = req.user.id;
        const post = req.params.PostId;
        const {comment} = req.body;
        const newComment=await Comment.create({
            post,
            user,
            comment
        });	
        const newpost = await Post.find({_id:post}).sort({createdAt:-1})
			.populate({
				path: 'user',
				select: 'name photo gender'
			}).limit(10);
        return newpost;
	},	
	delete: async (id) => {
		return await Comment.deleteMany({_id:id});
	},
};
