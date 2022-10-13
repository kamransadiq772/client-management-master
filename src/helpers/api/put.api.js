import generalBodyRequest from './generalBodyRequest.api';

/**
 * Makes a PUT Request
 * @param {string} apiPath - the api path string
 * @param {object} body - the request body
 * @param {boolean} [options.returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const putRequest = (apiPath, body, returnHeaders) => generalBodyRequest(apiPath, body, { method: 'PUT', returnHeaders });

export default putRequest;