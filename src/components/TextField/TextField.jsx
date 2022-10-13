import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FormField from 'components/FormField/FormField';

import { ReactComponent as ReadOnlyIcon } from 'images/icons/readOnly.svg';
import { ReactComponent as DisabledIcon } from 'images/icons/disabled.svg';
import { ReactComponent as ShowPasswordIcon } from 'images/icons/showPassword.svg';
import { ReactComponent as HidePasswordIcon } from 'images/icons/hidePassword.svg';

import Button from 'components/Button/Button';

import './TextField.css';

/**
 * @param {object} props
 * @param {array} [props.className = ''] - the class name passed down from the calling component
 * @param {('default'|'inline'|'placeholderLabel')} [props.variant = 'default'] - the type of form field
 * @param {string} props.label - the input's label
 * @param {'text'|'number'|'date'|'email'|'password'|'search'|'tel'|'time'|'datetime-local'|'range'|'color'|'url'|'week'} [props.type = 'text'] - the type of the input
 * @param {string} [props.value] - the current selected value
 * @param {function} props.onChange - the callback function for the click event
 * @param {boolean} [props.required] - is the input required?
 * @param {boolean} [props.disabled] - is the input disabled?
 * @param {boolean} [props.readOnly] - is the input readonly?
 * @param {object} [props.inputProps] - the prop types object
 * @param {number} [props.inputProps.min] - the minimum value for the number input
 * @param {number} [props.inputProps.max] - the maximum value for the number input
 * @param {number} [props.inputProps.size] - the size of the input field
 * @param {string} [props.inputProps.placeholder] - the placeholder for the input field
 * @param {bool} [props.inputProps.autoFocus] - should the input be focused on load?
 */
const TextField = ({
	className = '',
	variant = 'default',
	label,
	type = 'text',
	value,
	onChange,
	required,
	disabled,
	readOnly,
	inputProps,
}) => {

	const [isShowingPassword, setIsShowingPassword] = useState(false);

	useEffect(() => {
		return () => {
			setIsShowingPassword(false);
		};
	}, []);

	const combinedClassName = [
		'form-input',
		className,
	].filter(value => value).join(' ').trim();

	const combinedInputProps = {
		type: (
			type === 'password' && isShowingPassword
				? 'text'
				: type
		),
		value,
		onChange,
		required,
		disabled,
		readOnly,
		placeholder: (
			variant === 'placeholderLabel'
				? label
				: undefined
		),
		...inputProps,
	};

	return (
		<FormField
			className={combinedClassName}
			variant={variant === 'placeholderLabel' ? 'default' : variant}
			label={`${label}${required ? '*' : ''}`}
			disabled={disabled}
			hasNoLabel={variant === 'placeholderLabel'}
		>

			<input
				{...combinedInputProps}
			/>

			{(disabled || readOnly || type === 'password') &&
				<div className='form-field-icons'>

					{disabled &&
						<Button
							type='button'
							variant='simple'
							icon={<DisabledIcon />}
							iconButton
						/>
					}

					{readOnly &&
						<Button
							type='button'
							variant='simple'
							color='warning'
							icon={<ReadOnlyIcon />}
							iconButton
						/>
					}

					{type === 'password' &&
						<Button
							type='button'
							variant='simple'
							color='primary'
							icon={isShowingPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
							iconButton
							onClick={() => setIsShowingPassword(prevIsShowingPassword => !prevIsShowingPassword)}
						/>
					}

				</div>
			}

		</FormField>
	);
};
TextField.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(['default', 'inline', 'placeholderLabel']),
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['text', 'number', 'date', 'email', 'password', 'search', 'tel', 'time', 'datetime-local', 'range', 'color', 'url', 'week']),
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	inputProps: PropTypes.shape({
		min: PropTypes.number,
		max: PropTypes.number,
		size: PropTypes.number,
		placeholder: PropTypes.string,
		autoFocus: PropTypes.bool,
	}),
};

TextField.defaultValues = {
	className: '',
	variant: 'default',
	type: 'text',
};

export default TextField;