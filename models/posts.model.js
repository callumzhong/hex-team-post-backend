const mongoose = require('mongoose');
const PostConn = require('../connections/postConn');

const PostSchema = new mongoose.Schema(
	{
		user:{
			type: mongoose.Schema.ObjectId,
			ref: "user",
			required:[true,'貼文ID未填寫']
		},
		tags: [
			{
				type: String,
				default:'',
			},
		],
		type: {
			type: String,
			enum: ['group', 'person'],
			required: [true, '類型 type 未填寫'],
		},
		contentType:{
			type:String,
			enum:['photography','article'],
			required: [true, '類型 contentType 未填寫'],
		},
		image: {
			type: String,
			default: '',
		},		
		content: {
			type: String,
			default: '',
		},
		likes: [{ 
			type: mongoose.Schema.ObjectId, 
			ref: 'User' 
		  }],		
		//售價
		pay:{
			type: Number,
			required: [true, '售價未填寫'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		}
	},
	{
		versionKey: false,
		timestamps: true,
		toJSON: {virtuals:true},
		toObject: {virtuals:true},
	},
);

PostSchema.virtual('comments', {
	ref: 'Comment',
	foreignField: 'post',
	localField: '_id'
  });

  PostSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'comments',
      select: 'comment'
    });
  
    next();
  });


const Post = PostConn.model('Post', PostSchema);

module.exports = Post;
