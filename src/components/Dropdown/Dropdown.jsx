import PropTypes from 'prop-types';

import FormField from 'components/FormField/FormField';

import { ReactComponent as ArrowDownIcon } from 'images/icons/arrowDown.svg';
import { ReactComponent as DisabledIcon } from 'images/icons/disabled.svg';

import './Dropdown.css';
import Button from 'components/Button/Button';

/**
 * @param {object} props
 * @param {array} [props.className = ''] - the class name passed down from the calling component
 * @param {('default'|'inline')} [props.variant = 'default'] - the type of form field
 * @param {string} props.label - the select's label
 * @param {({value: string, label: string }[] | string[])} props.options - the select's option list
 * @param {string} [props.value] - the current selected value
 * @param {function} [props.getOptionLabel] - the function to get the label to show on the options
 * @param {function} props.onChange - the callback function for the click event
 * @param {boolean} [props.required] - is the select required?
 * @param {boolean} [props.disabled] - is the select disabled?
 * @param {boolean} [props.hasNoLabel] - should the dropdown be without a label?
*/
const Dropdown = ({
	className = '',
	variant = 'default',
	label,
	options,
	value,
	getOptionLabel,
	onChange,
	required,
	disabled,
	hasNoLabel,
}) => {

	const combinedClassName = [
		'form-dropdown',
		className,
	].filter(value => value).join(' ').trim();

	return (
		<FormField
			className={combinedClassName}
			variant={variant}
			label={`${label}${required ? '*' : ''}`}
			disabled={disabled}
			hasNoLabel={hasNoLabel || !label}
		>

			<select
				onChange={onChange}
				disabled={disabled}
				value={value}
			>
				{options.map(option =>
					<option
						key={option?.value ?? option}
						value={option?.value ?? option}
					>
						{getOptionLabel?.(option) ?? option?.label ?? option}
					</option>
				)}
			</select>

			<div className='form-field-icons'>

				{/* {value &&
					<Button
						variant='simple'
						icon={<ClearIcon />}
						iconButton
					/>
				} */}

				<Button
					color='primary'
					variant='simple'
					icon={<ArrowDownIcon />}
					iconButton
				/>

				{disabled &&
					<Button
						variant='simple'
						icon={<DisabledIcon />}
						iconButton
					/>
				}

			</div>

		</FormField>
	);
};

Dropdown.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(['default', 'inline']),
	label: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.arrayOf(
			PropTypes.shape({
				value: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired,
			}),
		),
		PropTypes.arrayOf(PropTypes.string.isRequired)
	]).isRequired,
	value: PropTypes.string,
	getOptionLabel: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	hasNoLabel: PropTypes.bool,
};

Dropdown.defaultValues = {
	className: '',
	variant: 'default',
};

export default Dropdown;