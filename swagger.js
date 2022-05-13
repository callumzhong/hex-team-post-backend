const swaggerAutogen = require('swagger-autogen')();
const doc = {
	info: {
		title: 'Meta API',
		description: 'Rest API documentation',
	},
	host: 'localhost:3000',
	schemes: ['http', 'https'],
	definitions: {
		Posts: {
			$name: 'Posted by Name',
			tags: ['旅遊'],
			$type: 'group',
			image: 'https://unsplash.com/photos/gKXKBY-C-Dk',
			$content: '今天去看貓',
			likes: 99,
			comments: 1,
		},
	},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// NOTE: if you use the express Router, you must pass in the
// 'endpointsFiles' only the root file where the route starts.

swaggerAutogen(outputFile, endpointsFiles, doc);
