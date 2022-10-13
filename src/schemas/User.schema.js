//@ts-check

import Schema from 'schemas/Schema.class';

const User = new Schema({
	name: 'Signup',
	fields: [
		{
			id: '_id',
			type: 'int',
			hidden: true,
			isPrimaryKey: true,
		},
		{
			id: 'email',
			type: 'string',
			immutable: true,
			formFieldProps: {
				type: 'email',
			},
		},
		{
			id: 'username',
			type: 'string',
			immutable: true,
			identifier: true,
		},
		{
			id: 'password',
			type: 'string',
			noView: true,
			formFieldProps: {
				type: 'password',
			},
		},
		{
			id: 'role',
			type: 'dropdown',
			immutable: true,
			dropdown: {
				options: ['user', 'admin'],
			}
		},
	],
});

export default User.schema;