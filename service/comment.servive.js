const Comment = require('../models/comments.model');

module.exports = {
	created: async (req) => {	
        const user = req.user.id;
        const post = req.params.PostId;
        const {comment} = req.body;
        return await Comment.create({
            post,
            user,
            comment
        });	
	},	
	delete: async (id) => {
		return await Comment.deleteMany({_id:id});
	},
};
