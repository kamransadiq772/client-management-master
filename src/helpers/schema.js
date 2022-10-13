import ClientSchema from 'schemas/Client.schema';
import UserSchema from 'schemas/User.schema';
import LoginSchema from 'schemas/Login.schema';

const schemas = {
	client: ClientSchema,
	user: UserSchema,
	signup: UserSchema,
	login: LoginSchema,
};

/**
 * Get list of schema fields
 * @param {'client'|'user'} schema - the schema to use
*/
const getSchemaFields = schema => schemas[schema].fields;

/**
 * Get list of schema fields to use on the view page
 * @param {'client'|'user'} schema - the schema to use
*/
const getSchemaViewFields = schema => schemas[schema].fields.filter(field => !field.isPrimaryKey && !field.hidden && !field.noView);

/**
 * Get list of schema fields to use on the form page
 * @param {'client'|'user'} schema - the schema to use
*/
const getSchemaFormFields = schema => schemas[schema].fields.filter(field => !field.isPrimaryKey && !field.hidden);

/**
 * Get the form object with value mapping
 * @param {'client'|'user'} schema - the schema to use
 * @param {object} [values] - the values to map to the fields
*/
const getSchemaFormMapping = (schema, values = {}) => {

	const newFieldMapping = schemas[schema].fields.reduce(
		(object, field) => ({
			...object,
			[field.id]: values[field.id] ?? (
				field.type === 'object'
					? null
					: ''
			),
		})
		, {}
	);

	return newFieldMapping;

};

/**
 * Get the id field of the given schema
 * @param {'client'|'user'} schema - the schema to use
 * @param {object} current - the schema object to get the id for
*/
const getIdValue = (schema, current) => current?.[schemas[schema].fields.find(field => field.isPrimaryKey).id] ?? undefined;

/**
 * Get the identifying field of the given schema
 * @param {'client'|'user'} schema - the schema to use
 * @param {object} current - the schema object to get the identifier for
*/
const getSchemaIdentifier = (schema, current) => current?.[schemas[schema].fields.find(field => field.identifier).id] ?? '';

export {
	getSchemaFields,
	getSchemaViewFields,
	getSchemaFormFields,
	getSchemaFormMapping,
	getIdValue,
	getSchemaIdentifier,
};