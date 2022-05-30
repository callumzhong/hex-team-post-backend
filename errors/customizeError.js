class CustomizeError extends Error {
	constructor(props) {
		super(props);
		this.name = this.constructor.name;
	}
}

module.exports = CustomizeError;
