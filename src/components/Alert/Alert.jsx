import { useEffect, useCallback } from 'react';
import useCompare from 'hooks/useCompare';
import PropTypes from 'prop-types';

import './Alert.css';

/**
 * @param {object} props
 * @param {object} props.alert - the object containing alert details
 * @param {number} props.alert.id - the alert id
 * @param {string} props.alert.message - the alert message
 * @param {'default'|'error'|'success'|'warning'|'info'|'primary'|'secondary'} [props.alert.type]
 * @param {boolean} [props.hasCancelButton] - should the alert have a cancel button?
 * @param {function} [props.onClose] - the function to call when the alert is closed by clicking the button
*/
const Alert = ({ alert, hasCancelButton, onClose, isRemoved }) => {

	const handleRemove = useCallback(
		() => {
			if (onClose)
				setTimeout(() => onClose?.(alert.id), 200);
		},
		[alert.id, onClose],
	);

	const hasIsRemovedChanged = useCompare(isRemoved);

	useEffect(() => {

		if (hasIsRemovedChanged && isRemoved)
			handleRemove();

	}, [hasIsRemovedChanged, isRemoved, onClose, handleRemove]);

	const className = [
		'alert-item',
		alert.type ?? '',
		isRemoved ? 'hidden' : '',
	].filter(value => value).join(' ').trim();

	return (
		<div
			className={className}
		>
			<span>
				{alert.message}
			</span>
			{hasCancelButton &&
				<span
					className='alert-close'
					onClick={({ target }) => {
						target.parentNode.classList.add('hidden');
						handleRemove();
					}}
				>
					✕
				</span>
			}
		</div>
	);
};

Alert.propTypes = {
	alert: PropTypes.object.isRequired,
	hasCancelButton: PropTypes.bool,
	onClose: PropTypes.func,
};

export default Alert;
