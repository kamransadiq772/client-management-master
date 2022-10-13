const { mongoose } = require( '../../connection');

const getError = require('./getError');

/**
 * gets the row given by id from the table
 * @param {*} request - the route's request parameter
 * @param {*} response - the route's response parameter
 * @param {string} tableName - name of the current table
*/
const create = (request, response, tableName) => {

	const Model = mongoose.model(tableName);

	Model
		.create(request.body)
		.then(document => response.status(201).json(document.toObject()))
		.catch(error => {
			const errorObject = getError(error);
			response.status(errorObject.code).json(errorObject.response);
		});

};

module.exports = create;