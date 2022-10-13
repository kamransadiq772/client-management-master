import { useContext } from 'react';
import PropTypes from 'prop-types';

import AlertContext from 'contexts/AlertContext';

import Button from 'components/Button/Button';

import { ReactComponent as CopyIcon } from 'images/icons/copy.svg';

import './Button.css';

const copyToClipboard = (textToCopy) => {

	if (navigator.clipboard && window.isSecureContext) {
		return navigator.clipboard.writeText(textToCopy);
	} else {

		// text area method
		let textArea = document.createElement("textarea");
		textArea.value = textToCopy;
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		return new Promise((resolve, reject) => {

			document.execCommand('copy')
				? resolve()
				: reject();

			textArea.remove();

		});

	}

};

/**
 * @param {object} props
 * @param {JSX.Element} [props.children]
 * @param {('filled'|'outlined'|'simple')} [props.variant = 'filled'] - the type of button
 * @param {('primary'|'secondary'|'success'|'error'|'warning'|'info')} [props.color] - the button's color
 * @param {boolean} [props.roundCorners = false] - should the button have round corners?
 * @param {('top'|'bottom')} [props.tooltipPlacement = 'top'] - the placement of the tooltip
 * @param {array} [props.className = ''] - the class name passed down from the calling component
 * @param {object} [props.buttonProps] - the attributes for the html button tag
 * @param {boolean} [props.disabled] - is the button disabled?
 * @param {string} props.toCopy - the string to copy to the clipboard
 */
const CopyButton = ({
	className,
	toCopy,
	...restProps
}) => {

	const { addAlert } = useContext(AlertContext);

	const handleClick = () => {
		copyToClipboard(toCopy)
			.then(() => addAlert('Copied', 'secondary'))
			.catch(() => addAlert('Failed To Copy! You May Need To Change Permissions!', 'error'));
	};

	const combinedClassName = [
		'copy-button',
		className,
	].filter(value => value).join(' ').trim();

	return (
		<Button
			className={combinedClassName}
			onClick={handleClick}
			icon={<CopyIcon />}
			tooltip='copy'
			iconButton
			{...restProps}
		/>
	);
};

CopyButton.propTypes = {
	children: PropTypes.any,
	variant: PropTypes.oneOf(['filled', 'outlined', 'simple']),
	color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
	roundCorners: PropTypes.bool,
	tooltipPlacement: PropTypes.oneOf(['top', 'bottom']),
	className: PropTypes.string,
	buttonProps: PropTypes.object,
	disabled: PropTypes.bool,
	toCopy: PropTypes.string.isRequired,
};

CopyButton.defaultValues = {
	variant: 'filled',
	roundCorners: false,
	tooltipPlacement: 'top',
	className: '',
};

export default CopyButton;