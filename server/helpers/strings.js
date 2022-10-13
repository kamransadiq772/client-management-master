/**
 * write multi-line strings and get a single line string as an output
 * @param {string} string - the input string
 * @returns single line output string
*/
const multiLineString = string => string.replace(/\s\s+/gm, ' ');

module.exports = {
	multiLineString,
};