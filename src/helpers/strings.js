/**
 * Takes In Pascal Case strings and outputs a humanized version with spaces
 * @param {string} string - the string to humanize
 * @returns {string} the formatted string
 */
const humanizeString = (string) => {

	const check = /(?<=[a-z0-9])([A-Z])/g;

	return `${string[0].toUpperCase()}${string.substring(1).replace(check, ' $1')}`;

};

export {
	humanizeString,
};