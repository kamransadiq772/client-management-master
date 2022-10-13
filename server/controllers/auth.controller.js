const jwt = require('jsonwebtoken');

const { mongoose } = require('../connection');

const { post: postUser } = require('./user.controller.js');

const { isPasswordCorrect, getRandomString } = require('../helpers/cryptography.js');
const CustomError = require('../helpers/errors/CustomError');
const { jwtSecret } = require('../helpers/constants');

const signup = (request, response) => postUser(request, response, 'user');

const login = (request, response) => {

	if (!request.body.user) {
		return response.status(400).json({ name: 'ValidationError', message: 'Missing URL Parameter User' });
	}
	else if (!request.body.password) {
		return response.status(400).json({ name: 'ValidationError', message: 'Missing URL Parameter Password' });
	}
	else if (request.headers.JWToken) {
		return response.status(400).json({ name: 'ValidationError', message: 'Already Signed In' });
	}

	const UserModel = mongoose.model('user');

	UserModel
		.findOne({
			$or: [
				{ username: request.body.user },
				{ email: request.body.user }
			],
		})
		.select('-__v -createdAt -updatedAt')
		.lean()
		.then((user) => {

			if (!user) {
				return response.status(401).json({ name: 'ValidationError', message: 'User Does Not Exist' });
			}

			const { password, ...userSansPassword } = user;

			const [userPassword, userSalt] = password.split(' ');

			const match = isPasswordCorrect(request.body.password, userPassword, userSalt);

			if (match) {

				const CSRF = getRandomString(25);

				const jwtObject = {
					_id: user._id,
					username: user.username,
					role: user.role,
					CSRF,
				};

				jwt.sign(
					jwtObject,
					jwtSecret,
					{ expiresIn: '7d' },
					(error, token) => {


						if (error) {
							throw new CustomError(500, error);
						}
						else {

							response.header('CSRF', CSRF);
							response.header('JWToken', token);
							response.status(200).json(userSansPassword);

						}

					}
				);

			}
			else {
				throw new CustomError(401, 'Username Password Combo Incorrect');
			}

		})
		.catch(error => {

			if (error instanceof CustomError) {

				const json = {
					name: 'AuthorizationError',
					error: typeof error.message === 'object' ? error.message : undefined,
					message: error.message.toString(),
				};
				response.status(error.code).json(json);

			}
			else {
				response.status(500).json({ name: 'InternalServerError', message: 'Problem With The Request' });
			}

		});

};

const verifyToken = (request, response, next) => {

	const CSRF = request.headers.CSRF ?? request.headers.csrf;
	const JWToken = request.headers.JWToken ?? request.headers.jwtoken;

	if (request.originalUrl.startsWith('/auth'))
		return next();

	else if (!JWToken)
		return response.status(403).json({ name: 'AuthorizationError', message: 'Not Signed In' });

	jwt.verify(
		JWToken,
		jwtSecret,
		(error, token) => {

			if (error) {

				if (error.name === 'TokenExpiredError') {
					return response.status(500).json({ name: 'AuthorizationError', message: 'Login Expired! Login To Continue' });
				}
				else {
					return response.status(500).json({ name: 'AuthorizationError', message: error.toString(), error });
				}

			}

			if (request.method !== 'GET' && token.CSRF !== CSRF) {
				return response.status(403).json({ name: 'AuthorizationError', message: 'Missing Or Incorrect CSRF Token' });
			}

			request.userID = token._id;
			next();

		});

};

module.exports = {
	signup,
	login,
	verifyToken,
};