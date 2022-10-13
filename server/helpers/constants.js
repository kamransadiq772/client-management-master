const jwtSecret = '57731062324a678ae936796f625cb6fd';

const encryption = {
	iterations: 1000000,
	pepper: '4c62017971d2a8f68f86bc96b4b95e70556592c4',
};

module.exports = {
	jwtSecret,
	encryption,
};