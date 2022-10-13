

const { getHashAndSalt } = require( '../helpers/cryptography');
const getAll = require( '../helpers/db/getAll');
const getByID = require( '../helpers/db/getByID');
const deleteByID = require( '../helpers/db/deleteByID');
const updateByID = require( '../helpers/db/updateByID');
const create = require( '../helpers/db/create');

const get = (request, response) => getAll(request, response, 'user');

const getOne = (request, response) => getByID(request, response, 'user');

const put = (request, response) => {

	if (request.body.password) {

		const password = getHashAndSalt(request.body.password);

		request.body.password = `${password.hash} ${password.salt}`;

	}

	updateByID(request, response, 'user');

};

const remove = (request, response) => deleteByID(request, response, 'user');

const post = (request, response) => {

	if (request.body.password) {

		const password = getHashAndSalt(request.body.password);

		request.body.password = `${password.hash} ${password.salt}`;

	}

	create(request, response, 'user');

};

module.exports = {
	get,
	getOne,
	put,
	remove,
	post,
};