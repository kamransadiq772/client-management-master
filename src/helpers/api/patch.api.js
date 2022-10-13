import generalBodyRequest from './generalBodyRequest.api';

/**
 * Makes a PATCH Request
 * @param {string} apiPath - the api path string
 * @param {object} body - the request body
 * @param {boolean} [options.returnHeaders] - should the request send back response headers?
 * @returns {Promise}
*/
const patchRequest = (apiPath, body, returnHeaders) => generalBodyRequest(apiPath, body, { method: 'PATCH', returnHeaders });

export default patchRequest;