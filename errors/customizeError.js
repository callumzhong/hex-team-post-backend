class CustomizeError extends Error {
	constructor(props) {
		super(props.message);
		this.status = props.status;
		this.name = this.constructor.name;
	}
}

module.exports = CustomizeError;
