import { getUser, removeUser } from 'helpers/auth';

import fetchApi from './fetchApi';

/**
 * Makes a POST, PUT, PATCH, or DELETE request to the api
 * @param {string} apiPath - the path of the api
 * @param {object} body - the request body
 * @param {object} options - the options to add to the fetch requests option object
 * @param {('POST'|'PUT'|'DELETE'|'PUT'|'PATCH')} [options.method] - the request method
 * @param {boolean} [options.returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const generalBodyRequest = (apiPath, body, options) => new Promise(
	(resolve, reject) => {

		const fetchOptions = {
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(body),
			...options,
		};

		if (!apiPath.includes('auth')) {
			const user = getUser();
			const CSRF = user?.CSRF;

			if (!CSRF) {
				removeUser();
				reject('Login Expired! Please Logout and Login Again.');
			};

			fetchOptions.headers.CSRF = CSRF;
		}

		fetchApi(apiPath, fetchOptions)
			.then(json => resolve(json))
			.catch(error => reject(error));

	}
);

export default generalBodyRequest;