const { Schema } = require('mongoose');
const { default: validator } = require('validator');

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			immutable: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			immutable: true,
			trim: true,
			validate: {
				validator: validator.isEmail,
				message: props => `${props.value} is not a valid email address`,
			},
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			required: true,
			immutable: true,
		},
	},
	{ timestamps: true, }
);

module.exports = UserSchema;