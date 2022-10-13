import PropTypes from 'prop-types';

import './FormField.css';

/**
 * @param {object} props
 * @param {JSX.Element} props.children
 * @param {array} [props.className = ''] - the class name passed down from the calling component
 * @param {('default'|'inline')} [props.variant = 'default'] - the type of form field
 * @param {string} props.label - the form field's label
 * @param {boolean} [props.disabled] - is the form field disabled?
 * @param {boolean} [props.hasNoLabel] - does the form field has no label?
*/
const FormField = ({
	children,
	className = '',
	variant = 'default',
	label,
	disabled,
	hasNoLabel = false,
}) => {

	const combinedClassName = [
		'form-field-container',
		variant,
		disabled ? 'disabled' : '',
		className,
	].filter(value => value).join(' ').trim();

	const handleFieldClick = event => {

		if (event.target === event.currentTarget)
			event.target.children.item(0).click();

	};

	return (
		<div className={combinedClassName}>

			{!hasNoLabel &&
				<label>{label}</label>
			}

			<div
				className='form-field'
				onClick={handleFieldClick}
			>
				{children}
			</div>

		</div>
	);
};

FormField.propTypes = {
	children: PropTypes.any.isRequired,
	className: PropTypes.string,
	variant: PropTypes.oneOf(['default', 'inline']),
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	hasNoLabel: PropTypes.bool,
};

FormField.defaultValues = {
	className: '',
	variant: 'default',
};

export default FormField;