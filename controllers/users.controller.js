const bcrypt = require('bcryptjs/dist/bcrypt');

const crypto = require('crypto');
const Users = require('../models/users.model');
const { generateSendJWT } = require('../service/auth.service');
const validator = require('validator');
const ErrorHandler = require('../service/errorHandler');
const { Success } = require('../service/appError');
const emailService = require('../service/email/email.service');
const postService = require('../service/post.service');
const followService = require('../service/follow.service');

const users = {
	async CreateUser(req, res, next) {
		try {
			const UserCount = await Users.find().count();
			if (UserCount === 500) {
				return ErrorHandler(new Error('超過會員上限!'), req, res, next);
			}
			let {
				email,
				password,
				confirmPassword,
				name,
				birthday,
				gender,
				photo,
				memo,
			} = req.body;

			// 加密密碼
			password = await bcrypt.hash(req.body.password, 12);
			const newUser = await Users.create({
				email,
				password,
				name,
				birthday,
				gender,
				photo,
				memo,
			});
			generateSendJWT(newUser, 200, res);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	//修改
	async EditUser(req, res, next) {
		let {  name, birthday, gender, photo,memo } =
				req.body;
				/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '修改使用者',
                    schema:{
						name:"123",
                        photo:"",
                        birthday:"2022-01-01",
                        gender:"male || female",                            
                        memo:'test'
                    }
                }*/
		const updUser= await Users.findByIdAndUpdate(req.user.id, {			
			name,
			birthday,
			gender,
			photo,memo
		},{new:true});
		return Success(res, updUser);;
	},
	//登入
	async singin(req, res, next) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return ErrorHandler(new Error('帳號密碼不可為空'), req, res, next);
			}
			const user = await Users.findOne({ email, delflag: false }).select(
				'+password',
			);
			if (!user) {
				return ErrorHandler(new Error('尚未註冊or已經刪除'), req, res, next);
			}
			const auth = await bcrypt.compare(password, user.password);
			if (!auth) {
				return ErrorHandler(new Error('您的密碼不正確'), req, res, next);
			}
			//console.log(user);
			generateSendJWT(user, 200, res);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	async delUser(req, res, next) {
		try {
			const email = req.params.email;
			const user = await Users.findOne({ email, delflag: false });
			if (!user) {
				return ErrorHandler(new Error('已經刪除過'), req, res, next);
			}
			const deluse = await Users.updateOne(
				{ email },
				{ $set: { delflag: true } },
			);
			if (deluse) {
				Success(res, { message: '刪除成功!' });
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	async updatePassword(req, res, next) {
		try {
			const { password, confirmPassword } = req.body;
			if (password !== confirmPassword) {
				return ErrorHandler(new Error('密碼不一致！'), req, res, next);
			}
			newPassword = await bcrypt.hash(password, 12);
			const user = await Users.findByIdAndUpdate(req.user.id, {
				password: newPassword,
			});
			generateSendJWT(user, 200, res);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	async forgotPassword(req, res, next) {
		try {
			const { email } = req.body;
			if (!email) {
				return ErrorHandler(new Error('email未填寫！'), req, res, next);
			}
			const finduser = await Users.findOne({ email, delflag: false });
			if (!finduser) {
				return ErrorHandler(new Error('尚未註冊or已經刪除'), req, res, next);
			}
			//產生密碼

			var pw = await crypto.randomBytes(32).toString('base64').substr(0, 12);
			const upduse = await Users.updateOne(
				{ email },
				{ $set: { password: await bcrypt.hash(pw, 12) } },
			);
			//const upduse=true;
			if (upduse) {
				emailService.send(
					{
						to: email,
						subject: '忘記密碼',
						html: `新密碼:${pw}，請<a href='${process.env.FroneEndUrl}'>登入</a>後修改密碼。`,
					},
					(err, info) => {
						if (err) {
							return ErrorHandler(err, req, res, next);
						}

						Success(res, { message: '忘記密碼，發送mail成功!' });
					},
				);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	async checkUser(req, res, next) {
		try {
			if (req.user) {
				Success(res, { message: '已經授權!' });
			}
		} catch (err) {
			//return ErrorHandler(err,req,res,next);
			return ErrorHandler(new Error('尚未授權'), req, res, next);
		}
	},
	async GetUser(req, res, next) {
		try {
			const userdata = await Users.findOne({ _id: req.user.id });
			// .populate({
			// 	path: 'posts',
			// 	select: 'type content image likes pay tags createdAt',
			// });
			const result = {
				user: userdata,
				postCounts: await postService.getPostCountbyGroup(req.user.id),
				follows: await followService.getUserFollowCount(req.user.id),
				privateposts: await postService.getPostCountbyGroup(req.user.id),
				likes: 0,
			};
			Success(res, result);
		} catch (err) {
			//return ErrorHandler(err,req,res,next);
			return ErrorHandler(new Error('尚未授權'), req, res, next);
		}
	},
	async GetUserById(req, res, next) {
		try {
			const _id = req.params.id;
			if (!_id) {
				return ErrorHandler(new Error('使用者ID未輸入'), req, res, next);
			}
			const userdata = await Users.findOne({ _id }).populate({
				path: 'posts',
				select: 'type content image likes pay tags',
			});
			const result = {
				user: userdata,
				postCounts: await postService.getPostCountbyGroup(_id),
				follows: await followService.getUserFollowCount(_id),
				privateposts: await postService.getPostCountbyGroup(_id),
				likes: await postService.getPostLikeCount(_id),
			};
			Success(res, result);
		} catch (err) {
			//return ErrorHandler(err,req,res,next);
			return ErrorHandler(new Error('尚未授權'), req, res, next);
		}
	},
};

module.exports = users;
