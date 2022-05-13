const swaggerAutogen = require('swagger-autogen')();
const doc = {
	info: {
		title: 'Meta API',
		description: 'Rest API documentation',
	},
	host: 'https://hex-post-team-api-server.herokuapp.com/',
	schemes: ['https'],
	definitions: {
		Post: {
			_id: '6274caa22a6bd4d1ecd8af05',
			$name: 'Posted by Name',
			tags: ['旅遊'],
			$type: 'group',
			image: 'https://unsplash.com/photos/gKXKBY-C-Dk',
			$content: '今天去看貓',
			likes: 99,
			comments: 1,
		},
		PostBody: {
			$name: 'Posted by Name',
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
	},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// NOTE: if you use the express Router, you must pass in the
// 'endpointsFiles' only the root file where the route starts.

swaggerAutogen(outputFile, endpointsFiles, doc);
