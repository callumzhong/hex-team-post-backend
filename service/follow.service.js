const follow = require('../models/follow.model');

module.exports = {	
	getAll: async (id) => {
        //取得所有追蹤
        return await follow.find({user:id});
    },  
	created: async (req) => {
		//加入追蹤
        const followOne=await follow.findOne({user: req.user.id});
        if(followOne){
            const newPost = await follow.findOneAndUpdate(
                {user:req.user.id},
                {$addToSet:{followuser:req.body.followuser}}
                ,{new:true}
                );
            return newPost;
        }else {
            const newPost = await follow.create({
                user:req.user.id,
                followuser:req.body.followuser});
            return newPost;
        }
        
	},
    delete: async(req)=>{
        return await follow.findOneAndUpdate(
            {user:req.user.id},
            {$pull:{followuser:req.params.followuser}}
            ,{new:true}
        );
    },
	getUserFollowCount: async(req)=>{
        //取得某個人的追蹤數
        return await follow.find({user:req.user.id}).count();
    }

};
