class CustomError extends Error {
	/**
	 * Custom error type
	 * @param {number} [code = 500] - the http response code of the error
	 * @param {string} [message = 'Unidentified Server Error'] - the error message
	*/
	constructor(code = 500, message = 'Unidentified Server Error') {
		super('CustomError');
		this.code = code;
		this.message = message;
	}
}

module.exports = CustomError;