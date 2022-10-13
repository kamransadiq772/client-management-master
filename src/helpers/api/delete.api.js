import generalBodyRequest from './generalBodyRequest.api';

/**
 * Makes a DELETE Request
 * @param {string} apiPath - the api path string
 * @param {object} [body = {}] - the request body
 * @param {boolean} [returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const deleteRequest = (apiPath, body = {}, returnHeaders) => generalBodyRequest(apiPath, body, { method: 'DELETE', returnHeaders });

export default deleteRequest;