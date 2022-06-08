const mongoose = require('mongoose');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Product = require('../models/product.model');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/products', () => {
	beforeEach((done) => {
		//Before each test we empty the database
		(async () => {
			await Product.deleteMany();
			await Product.create({
				name: '測試coin',
				type: 'coin',
				coin: 9999,
				price: 8000,
				discount: 3000,
			});
			await Product.create({
				name: '測試年訂閱',
				type: 'ticket',
				coin: 200,
				price: 0,
				discount: 0,
				effectiveOfMonthNumber: 12,
			});
			done();
		})();
	});
	describe('/GET', () => {
		it('它應該得到所有產品', (done) => {
			chai
				.request(app)
				.get('/api/products')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.status.should.be.eql('success');
					res.body.data.should.be.a('array');
					res.body.data.length.should.be.not.eql(0);
					done();
				});
		});
	});
	describe('/GET', () => {
		it('它應該得到 coin 產品', (done) => {
			chai
				.request(app)
				.get('/api/products?type=coin')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.status.should.be.eql('success');
					res.body.data.should.be.a('array');
					res.body.data.length.should.be.not.eql(0);
					res.body.data[0].type.should.be.eql('coin');
					done();
				});
		});
	});
	describe('/GET', () => {
		it('它應該得到 ticket 產品', (done) => {
			chai
				.request(app)
				.get('/api/products?type=ticket')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.status.should.be.eql('success');
					res.body.data.should.be.a('array');
					res.body.data.length.should.be.not.eql(0);
					res.body.data[0].type.should.be.eql('ticket');
					done();
				});
		});
	});
});
