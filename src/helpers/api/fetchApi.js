import { apiEndpoint, useDummyData } from 'config/config';

import { getUser, removeUser } from 'helpers/auth';

import dummyFetch from './.dummy/dummyFetch';

/**
 * the fetch api to use for http requests
 * @typedef {object} CustomOptions
 * @property {boolean} [CustomOptions.returnHeaders] - should the request send back response headers?
 * @typedef {RequestInit & CustomOptions} FetchOptions
 * @param {string} apiPath - the path of the request
 * @param {FetchOptions} [options = {}] - the request options
 * @returns {Promise}
*/
const fetchApi = (apiPath, options = {}) => new Promise(async (resolve, reject) => {

	const requestApi = useDummyData ? dummyFetch : fetch;

	const { returnHeaders, ...requestOptions } = options;

	if (!useDummyData && !apiPath.includes('auth')) {
		const user = getUser();
		const JWToken = user?.JWToken;

		if (!JWToken) {
			removeUser();
			reject('Login Expired! Please Logout and Login Again.');
		};

		requestOptions.headers = requestOptions.headers ?? {};
		requestOptions.headers.JWToken = JWToken;
	}

	requestApi(`${apiEndpoint}/${apiPath}`, requestOptions)
		.then(async response => {

			if (!response.ok) reject((await response.json())?.message ?? 'There Was A Problem With The Request!');

			const json = await response.json();

			if (returnHeaders) {
				json.headers = [...(response.headers?.keys?.() ?? [])].reduce(
					(object, key) => ({
						...object,
						[key]: response.headers.get(key),
					})
					, {}
				);
			}

			resolve(json);

		})
		.catch(error => reject(error));

});

export default fetchApi;