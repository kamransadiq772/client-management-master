import PropTypes from 'prop-types';

import './Tooltip.css';

/**
 * @param {object} props
 * @param {JSX.Element} [props.children]
 * @param {('top'|'bottom')} [props.placement = 'top'] - the type of button
 */
const Tooltip = ({ children, placement = 'top' }) => {
	return (
		<div
			className={`tooltip ${placement}`}
		>
			{children}
		</div>
	);
};

Tooltip.propTypes = {
	children: PropTypes.any,
	placement: PropTypes.oneOf(['top', 'bottom']),
};

Tooltip.defaultValues = {
	placement: 'top',
};

export default Tooltip;