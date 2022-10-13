import PropTypes from 'prop-types';

import Auth from 'containers/Auth';

/**
 * @param {object} props
 * @param {boolean} isLoading - is the app busy loading something?
 * @param {function} setIsLoading - the function to change app loading status
 * @param {boolean} props.isDarkTheme - is the app using dark theme?
 * @param {function} props.setIsDarkTheme - the setter function to change the app theme
*/
const Login = ({
	isLoading,
	setIsLoading,
	isDarkTheme,
	setIsDarkTheme
}) => (
	<Auth
		type='login'
		isLoading={isLoading}
		setIsLoading={setIsLoading}
		isDarkTheme={isDarkTheme}
		setIsDarkTheme={setIsDarkTheme}
	/>
);


Login.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	isDarkTheme: PropTypes.bool.isRequired,
	setIsDarkTheme: PropTypes.func.isRequired,
};

export default Login;