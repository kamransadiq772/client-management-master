import Tooltip from 'components/Tooltip/Tooltip';
import PropTypes from 'prop-types';

import './Button.css';

/**
 * @param {object} props
 * @param {JSX.Element} [props.children]
 * @param {('filled'|'outlined'|'simple')} [props.variant = 'filled'] - the type of button
 * @param {('primary'|'secondary'|'success'|'error'|'warning'|'info')} [props.color] - the button's color
 * @param {JSX.Element} [props.icon] - the icon to use on the button
 * @param {boolean} [props.roundCorners = false] - should the button have round corners?
 * @param {boolean} [props.iconButton = false] - is this an IconButton
 * @param {string} [props.tooltip] - the label to show in the tooltip
 * @param {('top'|'bottom')} [props.tooltipPlacement = 'top'] - the placement of the tooltip
 * @param {array} [props.className = ''] - the class name passed down from the calling component
 * @param {object} [props.buttonProps] - the attributes for the html button tag
 * @param {function} [props.onClick] - the callback function for the click event
 * @param {boolean} [props.disabled] - is the button disabled?
 * @param {('button'|'reset'|'submit')} [props.type] - the html type of the button
 */
const Button = ({
	children,
	variant = 'filled',
	color,
	icon,
	roundCorners = false,
	iconButton = false,
	tooltip,
	tooltipPlacement = 'top',
	className = '',
	onClick,
	disabled,
	type
}) => {

	const combinedClassName = [
		variant,
		color,
		roundCorners ? 'rounded' : '',
		iconButton ? 'icon' : '',
		className,
	].filter(value => value).join(' ').trim();

	const handleClick = (event) => {
		event.currentTarget.blur();
		onClick?.(event);
	};

	const buttonProps = {
		onClick: handleClick,
		disabled,
		type,
	};

	return (
		<button
			className={combinedClassName}
			{...buttonProps}
		>
			{!iconButton && children}
			{icon && icon}
			{tooltip &&
				<Tooltip
					placement={tooltipPlacement}
				>
					{tooltip}
				</Tooltip>
			}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.any,
	variant: PropTypes.oneOf(['filled', 'outlined', 'simple']),
	color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
	icon: PropTypes.object,
	roundCorners: PropTypes.bool,
	iconButton: PropTypes.bool,
	tooltip: PropTypes.string,
	tooltipPlacement: PropTypes.oneOf(['top', 'bottom']),
	className: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

Button.defaultValues = {
	variant: 'filled',
	roundCorners: false,
	iconButton: false,
	tooltipPlacement: 'top',
	className: '',
};

export default Button;