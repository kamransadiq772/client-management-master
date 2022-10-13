import fetchApi from './fetchApi';

/**
 * Makes a GET request
 * @param {string} apiPath - the path of the api
 * @param {boolean} [returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const getRequest = (apiPath, returnHeaders) => new Promise(
	(resolve, reject) => {

		fetchApi(apiPath, { returnHeaders })
			.then(json => resolve(json))
			.catch(error => reject(error));

	}
);

export default getRequest;