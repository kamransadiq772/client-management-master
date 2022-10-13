import PropTypes from 'prop-types';

import Auth from 'containers/Auth';

/**
 * @param {object} props
 * @param {boolean} isLoading - is the app busy loading something?
 * @param {function} setIsLoading - the function to change app loading status
 * @param {boolean} props.isDarkTheme - is the app using dark theme?
 * @param {function} props.setIsDarkTheme - the setter function to change the app theme
 * @param {function} props.onClose - the function to call when the page closes. returns true as first parameter if user created
 * @param {object} [props.currentUser] - the user to be edited. Sent only when used for user edit
*/
const Signup = ({
	isLoading,
	setIsLoading,
	isDarkTheme,
	setIsDarkTheme,
	onClose,
	currentUser,
}) => (
	<Auth
		type='signup'
		isLoading={isLoading}
		setIsLoading={setIsLoading}
		isDarkTheme={isDarkTheme}
		setIsDarkTheme={setIsDarkTheme}
		onClose={onClose}
		currentUser={currentUser}
	/>
);


Signup.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	isDarkTheme: PropTypes.bool.isRequired,
	setIsDarkTheme: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	currentUser: PropTypes.object,
};

export default Signup;