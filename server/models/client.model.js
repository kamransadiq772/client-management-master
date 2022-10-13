const { Schema, Types, model } = require('mongoose');
const { default: validator } = require('validator');

const isAnydeskAddress = value => validator.matches(value, /^[0-9]{3}[\s]?[0-9]{3}[\s]?[0-9]{3}$/);

const AnyDeskDetailsSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
			validate: {
				validator: isAnydeskAddress,
				message: props => `\`${props.value}\` is not a valid Anydesk address`,
			},
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
		_id: false
	},
);

const ServerDetailsSchema = new Schema(
	{
		ip: {
			type: String,
			trim: true,
			required: true,
			validate: {
				validator: validator.isIP,
				message: props => `\`${props.value}\` is not a valid IP address`,
			},
		},
		username: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
		_id: false,
	},
);

const FrontendDetailSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
			trim: true,
			validate: {
				validator: validator.isURL,
				message: props => `\`${props.value}\` is not a valid URL`,
			},
		},
		username: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
		_id: false,
	},
);

const BackendDetailSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
			validate: {
				validator: validator.isURL,
				message: props => `\`${props.value}\` is not a valid URL`,
			},
		},
	},
	{
		timestamps: false,
		_id: false,
	},
);

const ReportingServerDetailSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
			validate: {
				validator: validator.isURL,
				message: props => `\`${props.value}\` is not a valid URL`,
			},
		},
		username: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
		_id: false,
	},
);

const ClientSchema = new Schema(
	{
		clientName: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		anydesk: {
			type: AnyDeskDetailsSchema,
			required: false,
		},
		server: {
			type: ServerDetailsSchema,
			required: false,
		},
		frontend: {
			type: FrontendDetailSchema,
			required: false,
		},
		backend: {
			type: BackendDetailSchema,
			required: false,
		},
		reportingServer: {
			type: ReportingServerDetailSchema,
			required: false,
		},
		addedBy: {
			type: Types.ObjectId,
			required: true,
			ref: 'user',
			immutable: true,
			validate: {
				validator: value => model('user').exists({ _id: value }),
				message: props => `No user with the given id: \`${props.value}\` exists`
			},
			autopopulate: {
				select: '-__v -createdAt -updatedAt -password'
			},
		},
		lastEditBy: {
			type: Types.ObjectId,
			required: false,
			ref: 'user',
			validate: {
				validator: value => !value || model('user').exists({ _id: value }),
				message: props => `No user with the given id: \`${props.value}\` exists`
			},
			autopopulate: {
				select: '-__v -createdAt -updatedAt -password'
			},
			default: null,
		},
	},
	{ timestamps: true, },
);

ClientSchema.plugin(require('mongoose-autopopulate'));

module.exports = ClientSchema;