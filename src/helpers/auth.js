/**
 * @typedef {object} User - the user object
 * @property {string} _id - the user id
 * @property {string} username - the username
 * @property {string} email - the user's email address
 * @property {'admin' | 'user'} role - the user type
 * @property {string} CSRF - the CSRF token for the current user session
 * @property {string} JWToken - the JWT for the current user session
*/

/**
 * Returns the user object in local storage, or undefined
 * @typedef {User}
 * @returns {User | undefined} - the current user in the local storage
*/
const getUser = () => (
	localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user'))
		: undefined
);

/** Removes the current session user from local storage */
const removeUser = () => {
	localStorage.removeItem('user');
	window.dispatchEvent(new Event('storage'));
};

export {
	getUser,
	removeUser,
};