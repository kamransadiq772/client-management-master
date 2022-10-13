const { multiLineString } = require('../strings');

/**
 * Checks the error and sends back error object
 * @param {object} error
 * @returns {{ code: number, message: string }} the error object with error code and message
 */
const getError = error => {

	let responseCode = error.code ?? 500,
		responseMessage = error.message ?? error.toString();

	if (['MongoError', 'MongoServerError'].includes(error.name) && error.code === 11000) {

		const unique = Object.keys(error.keyValue).map(
			key => ({ key: key, value: error.keyValue[key] })
		);

		const message = multiLineString(`
			${unique.length > 1 ? 'Combination Of [' : 'Field'}
			${unique.map(row => row.key).join(', ')}
			${unique.length > 1 ? ']' : ''}
			Must Be Unique.
			${unique.length > 1 ? '[' : ''}
			${unique.map(row => `\`${row.value}\``).join(', ')}
			${unique.length > 1 ? ']' : ''}
			Already Exists.
		`);

		responseCode = 409;
		responseMessage = message;

	}
	else if (error.name === 'ValidationError' && error.errors) {

		responseCode = 409;

		error.message = getErrorMessage(error);
		const errorsMessages = error.message.split(',').filter(message => message);

		responseMessage = (
			(errorsMessages?.[0] ?? 'Validation Error')
				.replace(/\./g, ' ')
				.replace(/(?<=[a-zA-Z0-9])([A-Z])/g, ' $1')
				.replace(/(?<=\s|^)./g, match => match.toUpperCase())
				.trim()
		) + (
				errorsMessages.length > 1
					? ` & ${errorsMessages.length - 1} Other Errors`
					: ''
			);
	}

	return {
		code: responseCode,
		response: {
			name: error.name ?? 'InternalServerError',
			message: responseMessage,
			error,
		},
	};

};

const getErrorMessage = error => {

	if (error.errors) {
		let errorKeys = Object.keys(error.errors);
		errorKeys = errorKeys.filter(key => !key.includes('.') || errorKeys.every(testKey => testKey !== key.split('.')[0]))
		return errorKeys.map(key => `${error.path ? `${error.path} ` : ''}${getErrorMessage(error.errors[key])}`).join(', ');
	}

	return error.path + ' ' + (
		error.message
			.replace(/(^\s)|((:|Path).*`)/g, '')
			.replace(/^\s|(?<=\s)\s+/g, '')
	);

};

module.exports = getError;