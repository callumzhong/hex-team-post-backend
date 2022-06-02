require('dotenv').config({
	path: './test.env',
});
const mongoose = require('mongoose');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/products', () => {
	// beforeEach((done) => {
	// 	//Before each test we empty the database
	// });
	/*
	 * Test the /GET route
	 */
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
});
