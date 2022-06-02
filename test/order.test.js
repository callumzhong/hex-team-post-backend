const mongoose = require('mongoose');
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/users.model');
const Post = require('../models/posts.model');
const Payment = require('../models/payment.model');
const orderServe = require('../service/order.service');
const Product = require('../models/product.model');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/order', () => {
	describe('/POST', () => {
		beforeEach((done) => {
			//Before each test we empty the database
			Order.deleteMany({}).then(() => {
				done();
			});
		});
		it('它應該依產品ID建立訂單', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});

				const body = {
					productId: '628f4384ed7cdd7d4d735444',
				};
				chai
					.request(app)
					.post('/api/order')
					.set('authorization', token)
					.send(body)
					.end((err, res) => {
						res.should.have.status(201);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('object');
						done();
					});
			})();
		});
	});
	describe('/POST', () => {
		it('它應該建立購買私密日記訂單, 但是餘額不足', (done) => {
			(async () => {
				const user = await User.findOne();
				const post = await Post.findOne({ type: 'person' });
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});
				// 清空餘額測試
				await Order.deleteMany({
					user: user.id,
					type: 'ADD_CREDIT',
				});
				const body = {
					postId: post.id,
				};
				chai
					.request(app)
					.post(`/api/order/pay/private`)
					.set('authorization', token)
					.send(body)
					.end((err, res) => {
						console.log('訂單log', res.body);
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status');
						res.body.should.have.property('message');
						res.body.status.should.be.eql('error');
						res.body.message.should.be.eql('餘額不足');
						done();
					});
			})();
		});

		it('它應該有餘額的情況下，成功購買私密日記訂單 ', (done) => {
			(async () => {
				const user = await User.findOne();
				const post = await Post.findOne({ type: 'person' });
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});

				// 清空
				await Payment.deleteMany({});
				await Order.deleteMany({
					user: user.id,
					type: 'ADD_CREDIT',
				});

				//虛擬入款
				const product = await Product.findOne();
				const order = await orderServe.created(product.id, user);
				const payment = await Payment.create({
					status: true,
					code: 'TEST',
					message: '測試',
					tradeNo: +Date.now(),
					merchantOrderNo: +Date.now(),
					payTime: Date.now(),
				});
				await Order.findByIdAndUpdate(order.id, {
					payment: payment.id,
				});

				const body = {
					postId: post.id,
				};
				chai
					.request(app)
					.post(`/api/order/pay/private`)
					.set('authorization', token)
					.send(body)
					.end((err, res) => {
						console.log('訂單log', res.body);
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('status');
						res.body.should.have.property('data');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.eql('購買成功');
						done();
					});
			})();
		});
	});

	describe('/GET status', () => {
		it('它應該依訂單ID查詢狀態', (done) => {
			(async () => {
				const order = await Order.findOne();
				chai
					.request(app)
					.get(`/api/order/status?orderId=${order.id}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('status');
						res.body.should.have.property('data');
						res.body.data.should.have.property('status');
						res.body.data.should.have.property('message');
						done();
					});
			})();
		});
	});
});
