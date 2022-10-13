//@ts-check

import Schema from 'schemas/Schema.class';

const Login = new Schema({
	name: 'Login',
	fields: [
		{
			id: 'user',
			label: 'Username or Email',
			type: 'string',
		},
		{
			id: 'password',
			type: 'string',
			formFieldProps: {
				type: 'password',
			},
		},
	],
});

export default Login.schema;