mongoose = require('mongoose');
const PostConn = require('../connections/post.connection');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true
      
    },
    photo: String,
    gender:{
      type: String,
      enum:["male","female"]
    },
    password:{
      type: String,
      required: [true,'請輸入密碼'],
      minlength: 8,
      select: false
    },
    memo: String,
    birthday:{
      type:Date,
      required: [true,'請輸入生日'],
    },
    delflag:{
      type:Boolean,
      default:false
    }, 
    following:[{ 
      type: mongoose.Schema.ObjectId, 
      ref: 'user' 
    }],
    followers: [{ 
      type: mongoose.Schema.ObjectId, 
      ref: 'user' 
    }],
  },{
		//versionKey: false,
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

userSchema.virtual('posts', {
	ref: 'Post',
	foreignField: 'user',
	localField: '_id',
});
// User
const User = PostConn.model('user', userSchema);

module.exports = User;
