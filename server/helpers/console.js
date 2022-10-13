const codes = {
	prefix: '\u001b[',
	suffix: 'm',

	reset: 0,
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	inverse: 7,
	hidden: 8,
	strikethrough: 9,

	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	white: 37,
	gray: 90,
	grey: 90,
};

/**
 * gets the console color code for the given color
 * @param {'reset'|'bold'|'dim'|'italic'|'underline'|'inverse'|'hidden'|'strikethrough'|'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white'|'grey'|'gray'|'blackBg'|'redBg'|'greenBg'|'yellowBg'|'blueBg'|'magentaBg'|'cyanBg'|'whiteBg'|'greyBg'|'grayBg'} code
 * @returns {string}
*/
const code = code => `${codes.prefix}${code.endsWith('Bg') ? codes[code.substr(-2) ] + 10 : codes[code]}${codes.suffix}`;

module.exports = {
	reset: code('reset'),
	bold: code('bold'),
	dim: code('dim'),
	italic: code('italic'),
	underline: code('underline'),
	inverse: code('inverse'),
	hidden: code('hidden'),
	strikethrough: code('strikethrough'),

	black: code('black'),
	red: code('red'),
	green: code('green'),
	yellow: code('yellow'),
	blue: code('blue'),
	magenta: code('magenta'),
	cyan: code('cyan'),
	white: code('white'),
	grey: code('grey'),
	gray: code('gray'),

	blackBg: code('blackBg'),
	redBg: code('redBg'),
	greenBg: code('greenBg'),
	yellowBg: code('yellowBg'),
	blueBg: code('blueBg'),
	magentaBg: code('magentaBg'),
	cyanBg: code('cyanBg'),
	whiteBg: code('whiteBg'),
	greyBg: code('greyBg'),
	grayBg: code('grayBg'),
};