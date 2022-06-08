const options = {
	info: {
		version: '1.0.0',
		title: 'Meta API',
		description: 'Rest API documentation',
	},
	security: {
		apiKeyAuth: {
			type: 'apiKey',
			name: 'authorization',
			in: 'header',
		},
	},
	baseDir: __dirname,
	// Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
	filesPattern: './routes/*.js',
	// URL where SwaggerUI will be rendered
	swaggerUIPath: '/api-doc',
	// Expose OpenAPI UI
	exposeSwaggerUI: true,
	// Expose Open API JSON Docs documentation in `apiDocsPath` path.
	exposeApiDocs: false,
	// Open API JSON Docs endpoint.
	apiDocsPath: '/v3/api-doc',
	// Set non-required fields as nullable by default
	notRequiredAsNullable: false,
	// You can customize your UI options.
	// you can extend swagger-ui-express config. You can checkout an example of this
	// in the `example/configuration/swaggerOptions.js`
	swaggerUiOptions: {},
	// multiple option in case you want more that one instance
	multiple: true,
};

module.exports = options;
