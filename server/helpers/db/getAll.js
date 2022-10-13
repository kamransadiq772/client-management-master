const { mongoose } = require( '../../connection');
const getError = require('./getError');

/**
 * gets multiple fields from the table, optionally filtered by the given filter
 * @param {*} request - the route's request parameter
 * @param {*} response - the route's response parameter
 * @param {string} tableName - name of the current table
*/
const getAll = (request, response, tableName) => {

	const Model = mongoose.model(tableName);

	Model
		.find(request.query)
		.select('-__v -createdAt -updatedAt -password')
		.sort(request.sort)
		.lean()
		.then(documents => response.status(200).json(documents))
		.catch(error => {
			const errorObject = getError(error);
			response.status(errorObject.code).json(errorObject.response);
		});

};

module.exports = getAll;