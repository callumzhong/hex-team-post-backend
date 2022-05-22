mongoose = require('mongoose');
const PostConn = require('../connections/postConn');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    sex:{
      type: String,
      enum:["male","female"]
    },
    password:{
      type: String,
      required: [true,'請輸入密碼'],
      minlength: 8,
      select: false
    },
    birthday:{
      type:Date,
      required: [true,'請輸入生日'],
    },
    delflag:{
      type:Boolean,
      default:false
    }
  },{
    versionKey: false,
    timestamps: true,
  });
// User
const User = PostConn.model('user', userSchema);

module.exports = User;