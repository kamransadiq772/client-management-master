const getAll = require( '../helpers/db/getAll');
const getByID = require( '../helpers/db/getByID');
const deleteByID = require( '../helpers/db/deleteByID');
const updateByID = require( '../helpers/db/updateByID');
const create = require( '../helpers/db/create');

const get = (request, response) => getAll(request, response, 'client');

const getOne = (request, response) => getByID(request, response, 'client');

const put = (request, response) => {
	request.body.lastEditBy = request.userID;
	updateByID(request, response, 'client');
};

const remove = (request, response) => deleteByID(request, response, 'client');

const post = (request, response) => {
	request.body.addedBy = request.userID;
	create(request, response, 'client');
};

module.exports = {
	get,
	getOne,
	put,
	remove,
	post,
};