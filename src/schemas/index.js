import ClientSchema from './Client.schema';
import UserSchema from './User.schema';
import LoginSchema from './Login.schema';

/** Array of all available schemas */
const schemaList = [
	ClientSchema,
	UserSchema,
	LoginSchema,
];

export default schemaList;

export {
	ClientSchema as Client,
	UserSchema as User,
	LoginSchema as Login,
};