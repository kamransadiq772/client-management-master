const { mongoose } = require( '../../connection');
const getError = require('./getError');

/**
 * gets the row given by id from the table
 * @param {*} request - the route's request parameter
 * @param {*} response - the route's response parameter
 * @param {string} tableName - name of the current table
*/
const getByID = (request, response, tableName) => {

	if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
		return response.status(400).json({ name: 'ValidationError', message: `ID \`${request.params.id}\` Is Not Valid` });
	}

	const Model = mongoose.model(tableName);

	Model
		.findById(request.params.id)
		.select('-__v -createdAt -updatedAt -password')
		.lean()
		.then(document => response.status(200).json(document))
		.catch(error => {
			const errorObject = getError(error);
			response.status(errorObject.code).json(errorObject.response);
		});

};

module.exports = getByID;