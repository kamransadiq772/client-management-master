const { mongoose } = require('../../connection');
const getError = require('./getError');

/**
 * deletes the row given by id from the table
 * @param {*} request - the route's request parameter
 * @param {*} response - the route's response parameter
 * @param {*} tableName - name of the current table
 */
const deleteByID = (request, response, tableName) => {

	if (!mongoose.Types.ObjectId.isValid(request.params.id))
		return response.status(400).json({ name: 'ValidationError', message: `ID \`${request.params.id}\` Is Not Valid` });

	const Model = mongoose.model(tableName);

	Model
		.findByIdAndDelete(request.params.id)
		.lean()
		.then(document => response.status(200).json(document))
		.catch(error => {
			const errorObject = getError(error);
			response.status(errorObject.code).json(errorObject.response);
		});

};

module.exports = deleteByID;