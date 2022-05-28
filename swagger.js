const swaggerAutogen = require('swagger-autogen')();
const doc = {
	info: {
		title: 'Meta API',
		cersion: '1.0.0',
		description: 'Rest API documentation',
	},
	host: 'hex-post-team-api-server.herokuapp.com',
	// host: 'localhost:3000',
	// schemes: ['http'],
	schemes: ['https'],
	securityDefinitions: {
		apiKeyAuth: {
			type: 'apiKey',
			in: 'headers',
			name: 'authorization',
			description: '請加上 API Token',
		},
	},
	definitions: {
		Post: {
			_id: '6274caa22a6bd4d1ecd8af05',			
			tags: ['旅遊'],
			$type: 'group',
			image: 'https://unsplash.com/photos/gKXKBY-C-Dk',
			$content: '今天去看貓',
			likes: 99,
			comments: 1,
		},
		PostBody: {
			tags: ['旅遊'],
			$type: 'group',
			image: 'https://unsplash.com/photos/gKXKBY-C-Dk',
			$content: '今天去看貓',
			likes: 99,
			comments: 1,
		},
		PostPage: {
			data: {
				$ref: '#/definitions/Post',
			},
			pagination: {
				total_pages: 1,
				current_page: 1,
				has_pre: false,
				has_next: false,
			},
		},
		AddEmail: {
			to: 'test@gmail.com',
			subject: '主旨',
			html: '<b>Hello world?</b>',
			text: 'Hello world?',
		},
		UploadImage: {
			status: true,
			data: {
				imgUrl: 'https://i.imgur.com/w5L5wWI.jpg',
			},
		},
		Product: {
			status: 'success',
			data: [
				{
					_id: '628f4384ed7cdd7d4d735444',
					name: '秘密鑽石',
					coin: 20,
					price: 100,
					discount: 0,
					tag: '新手入門',
				},
			],
		},
	},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// NOTE: if you use the express Router, you must pass in the
// 'endpointsFiles' only the root file where the route starts.

swaggerAutogen(outputFile, endpointsFiles, doc);
