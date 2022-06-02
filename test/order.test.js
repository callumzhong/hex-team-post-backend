require('dotenv').config({
	path: './test.env',
});

const mongoose = require('mongoose');
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Order', () => {
	/*
	 * Test the /GET route
	 */
	describe('/POST Order', () => {
		beforeEach((done) => {
			//Before each test we empty the database
			Order.deleteMany({}).then(() => {
				done();
			});
		});
		it('它應該依產品ID建立訂單', (done) => {
			const token = jwt.sign(
				{ id: '628f424cd80afc98879fee67' },
				process.env.JWT_SECRET,
				{
					expiresIn: process.env.JWT_EXPIRES_DAY,
				},
			);

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
		});
	});
	describe('/GET Order', () => {
		it('它應該依訂單ID查詢狀態', (done) => {
			Order.findOne().then((doc) => {
				const id = doc._id.toString();
				chai
					.request(app)
					.get(`/api/order/status?orderId=${id}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('status');
						res.body.should.have.property('data');
						res.body.data.should.have.property('status');
						res.body.data.should.have.property('message');
						done();
					});
			});
		});
	});
});
