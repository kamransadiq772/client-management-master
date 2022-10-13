import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import AlertContext from 'contexts/AlertContext';

import postRequest from 'helpers/api/post.api';
import { humanizeString } from 'helpers/strings';
import { getSchemaFormFields, getIdValue } from 'helpers/schema';

import TextField from 'components/TextField/TextField';
import Dropdown from 'components/Dropdown/Dropdown';
import Button from 'components/Button/Button';

import { ReactComponent as WiMetrixLogo } from 'images/logo.svg';
import { ReactComponent as DarkModeIcon } from 'images/icons/darkMode.svg';
import { ReactComponent as LightModeIcon } from 'images/icons/lightMode.svg';
import { ReactComponent as ArrowRightIcon } from 'images/icons/arrowRight.svg';
import { ReactComponent as BackIcon } from 'images/icons/arrowLeft.svg';
import { ReactComponent as LoadingIcon } from 'images/icons/loading.svg';

import './Auth.css';
import putRequest from 'helpers/api/put.api';

/**
 * Get initial form state for the current page by schema
 * @param {'login'|'signup'} schemaType - the type of the current page
 * @param {object} [current] - the current object to use for default values
*/
const getInitialForm = (schemaType, current) => getSchemaFormFields(schemaType).reduce(
	(object, value) => ({
		...object,
		[value.id]: current?.[value.id] ?? '',
	})
	, {}
);

/**
 * @param {object} props
 * @param {'login'|'signup'} props.type - is the component used for Login or Signup?
 * @param {boolean} props.isLoading - is the app busy loading something?
 * @param {function} props.setIsLoading - the function to change app loading status
 * @param {boolean} props.isDarkTheme - is the app using dark theme?
 * @param {function} props.setIsDarkTheme - the setter function to change the app theme
 * @param {function} [props.onClose] - the function to call when the signup page closes. returns true as first parameter if user created
 * @param {object} [props.currentUser] - the user to be edited. Sent only when used for user edit
*/
const Auth = ({
	type,
	isLoading,
	setIsLoading,
	isDarkTheme,
	setIsDarkTheme,
	onClose,
	currentUser,
}) => {

	const { addAlert } = useContext(AlertContext);

	const [form, setForm] = useState(getInitialForm(type, currentUser));

	useEffect(() => {
		return () => {
			setForm(getInitialForm(type));
		};
	}, [type]);

	const handleFormChange = (field, newValue) => (
		setForm(prevForm => ({
			...prevForm,
			[field.id]: newValue
		}))
	);

	const handleSubmit = event => {

		event.preventDefault();

		if (isLoading) return addAlert('App is busy. Please try again.', 'info');

		setIsLoading(true);

		const apiPath = type === 'login' ? `auth/${type}` : `users/${currentUser ? getIdValue(type, currentUser) : ''}`;
		const requestType = type === 'signup' && currentUser ? putRequest : postRequest;

		requestType(apiPath, form, true)
			.then(({ headers, ...user }) => {

				const successMessage = (
					type === 'login'
						? 'Logged In! Please Wait'
						: `User ${currentUser ? 'Edited' : 'Created'}!`
				);
				addAlert(successMessage, 'success');

				setTimeout(() => {

					if (type === 'login') {

						const newUser = {
							...user,
							CSRF: headers.csrf,
							JWToken: headers.jwtoken,
						};

						localStorage.setItem('user', JSON.stringify(newUser));
						window.dispatchEvent(new Event('storage'));

					}
					else {
						onClose(true);
					}

				}, 500);

			})
			.catch(error => addAlert(error, 'error'))
			.finally(() => setIsLoading(false));

	};

	return (
		<div
			className={`auth-page ${type}-page page-body`}
		>

			{type === 'signup' &&
				<Button
					className='navigation-back'
					color='secondary'
					icon={<BackIcon />}
					tooltip='Back'
					tooltipPlacement='bottom'
					iconButton
					onClick={() => onClose(false)}
				/>
			}

			<Button
				className='theme-switch'
				color='secondary'
				icon={isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
				tooltip={`${isDarkTheme ? 'Light' : 'Dark'} Mode`}
				tooltipPlacement='bottom'
				iconButton
				onClick={() => setIsDarkTheme(prevIsDarkTheme => !prevIsDarkTheme)}
			/>

			<aside>

				<WiMetrixLogo className='auth-logo' />
				<hr />
				<h1>Client Management</h1>
				{type === 'signup' &&
					<h3>{currentUser ? 'Edit Existing User' : 'Add A New User'}</h3>
				}

			</aside>

			<div className='auth-content'>

				<form
					className='scroll-y'
					onSubmit={handleSubmit}
				>

					{getSchemaFormFields(type).map(field => {

						const Component = field.type === 'dropdown' ? Dropdown : TextField;

						return (
							<Component
								key={field.id}
								label={field.label ?? humanizeString(field.id)}
								value={form[field.id]}
								onChange={({ target }) => handleFormChange(field, target.value)}
								required={!field.canBeNull}
								disabled={Boolean(field.immutable && currentUser)}
								options={field.type === 'dropdown' ? field.dropdown.options : undefined}
								{...field.formFieldProps}
							/>
						);
					})}

					<Button
						className={isLoading ? 'loading' : ''}
						color='primary'
						icon={isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
						type='submit'
						iconButton={isLoading}
					>
						{humanizeString(type)}
					</Button>

				</form>

			</div>

		</div>
	);
};


Auth.propTypes = {
	type: PropTypes.oneOf(['login', 'signup']),
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	isDarkTheme: PropTypes.bool.isRequired,
	setIsDarkTheme: PropTypes.func.isRequired,
	onClose: PropTypes.func,
	currentUser: PropTypes.object,
};

export default Auth;