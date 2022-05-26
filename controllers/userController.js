const bcrypt = require('bcryptjs/dist/bcrypt');
const crypto = require('crypto');
const Users = require('../models/usersModel');
const { generateSendJWT } = require('../service/authService');
const validator = require('validator');
const ErrorHandler = require('../service/errorHandler');
const { Success } = require('../service/appError');
const emailHandler = require('../service/email/emailHandler');

const users = {
	//* #swagger.security = [{ "apiKeyAuth": [] }]
	async CreateUser(req, res, next) {
		/**
		 * #swagger.tags = ['user - 使用者']
		 * #swagger.summary = '註冊使用者'
		 */
		try {
			let { email, password, confirmPassword, name, birthday, gender } =
				req.body;
			/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $name:'Ray',
                        $email:"123@123.com",
                        photo:"",
                        birthday:"2022-01-01",
                        gender:"male || female",                            
                        $password:"12345678",
                        $confirmPassword:"12345678"
                    }
                }*/

			// 內容不可為空
			if (!email || !password || !confirmPassword || !name || !birthday) {
				return ErrorHandler(new Error('欄位未填寫正確！'), req, res, next);
			}
			// 密碼正確
			if (password !== confirmPassword) {
				return ErrorHandler(new Error('密碼不一致！'), req, res, next);
			}
			// 密碼 8 碼以上
			if (!validator.isLength(password, { min: 8 })) {
				return ErrorHandler(new Error('密碼字數低於 8 碼'), req, res, next);
			}
			// 是否為 Email
			if (!validator.isEmail(email)) {
				return ErrorHandler(new Error('Email 格式不正確'), req, res, next);
			}

			// 加密密碼
			password = await bcrypt.hash(req.body.password, 12);
			const newUser = await Users.create({
				email,
				password,
				name,
				birthday,
				gender,
			});
			generateSendJWT(newUser, 200, res);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	//登入
	async singin(req, res, next) {
		/**
		 * #swagger.tags = ['user - 使用者']
		 * #swagger.summary = '使用者登入'
		 */
		try {
			/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $email:'123@123.com',
                        $password:"12345678"                        
                    }
                }*/
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
			generateSendJWT(user, 200, res);
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
	async delUser(req, res, next) {
		try {
			/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $email:'123@123.com'                                             
                    }
                }*/
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
			/* 
             #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $password:'12345678',
                        $confirmPassword:"12345678"                        
                    }
                }*/
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
			/* 
            #swagger.parameters['obj'] = {
                   in: 'body',
                   description: '資料格式',
                   schema:{
                       $email:'123@12333.com'                                         
                   }
               }*/
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
				emailHandler.send(
					{
						to: email,
						subject: '忘記密碼',
						html: `新密碼:${pw}，請<a href='${process.env.FroneEndUrl}'>登入</a>後修改密碼。`,
					},
					(err, info) => {
						if (err) {
							/* #swagger.responses[400] = {
                            schema:{
                                status:'ERROR',
                                message:'smtp 錯誤訊息'
                    },
                            description: "忘記密碼，發信失敗" 
                        }*/
							return ErrorHandler(err, req, res, next);
						}
						/* #swagger.responses[200] = {
                        schema:{
                            status: 'true',
                            data: {
                                message:'忘記密碼，發送mail成功!'
                            }
                        },
                        description: "忘記密碼，發信成功"
                    } 
                    */
						Success(res, { message: '忘記密碼，發送mail成功!' });
					},
				);
			}
		} catch (err) {
			return ErrorHandler(err, req, res, next);
		}
	},
};

module.exports = users;
