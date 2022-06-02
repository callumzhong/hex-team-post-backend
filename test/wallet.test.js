const mongoose = require('mongoose');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/users.model');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/wallet', () => {
	describe('/GET', () => {
		it('它應該得到代幣餘額', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});
				chai
					.request(app)
					.get('/api/wallet')
					.set('authorization', token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('number');
						done();
					});
			})();
		});
	});
	describe('/GET', () => {
		it('它應該得到購買代幣紀錄', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});
				chai
					.request(app)
					.get('/api/wallet/record/add-credit')
					.set('authorization', token)
					.end((err, res) => {
						console.log(res.body);
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('array');
						res.body.data.length.should.be.not.eql(0);
						done();
					});
			})();
		});
	});
	describe('/GET', () => {
		it('它應該得到日記購買紀錄', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});
				chai
					.request(app)
					.get('/api/wallet/record/pay')
					.set('authorization', token)
					.end((err, res) => {
						console.log(res.body);
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('array');
						res.body.data.length.should.be.not.eql(0);
						done();
					});
			})();
		});
	});
	describe('/GET', () => {
		it('它應該得到日記銷售紀錄', (done) => {
			(async () => {
				const user = await User.find().then((documents) => {
					return documents[documents.length - 1];
				});
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});
				chai
					.request(app)
					.get('/api/wallet/record/income')
					.set('authorization', token)
					.end((err, res) => {
						console.log(res.body);
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('array');
						res.body.data.length.should.be.not.eql(0);
						done();
					});
			})();
		});
	});
});
