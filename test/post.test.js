const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/users.model');
const Post = require('../models/posts.model');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/posts', () => {
	/*
	 * Test the /POST route
	 */
	describe('/POST private', () => {
		beforeEach((done) => {
			//Before each test we empty the database
			Post.deleteMany({
				type: 'person',
			}).then(() => {
				done();
			});
		});
		it('它應該建立私密日記', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});

				const body = {
					tags: 'test',
					contentType: 'photography',
					image: 'https://i.imgur.com/0F374vh.jpeg',
					content: '這是一隻刺蝟',
					pay: 10,
				};
				chai
					.request(app)
					.post('/api/posts/private')
					.set('authorization', token)
					.send(body)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('_id');
						done();
					});
			})();
		});
	});
});
