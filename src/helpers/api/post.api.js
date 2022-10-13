import generalBodyRequest from './generalBodyRequest.api';

/**
 * Makes a POST Request
 * @param {string} apiPath - the api path string
 * @param {object} body - the request body
 * @param {boolean} [returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const postRequest = (apiPath, body, returnHeaders) => generalBodyRequest(apiPath, body, { method: 'POST', returnHeaders });

export default postRequest;