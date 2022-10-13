import PropTypes from 'prop-types';

import Alert from './Alert';

import './AppAlerts.css';

/**
 * @param {object} props
 * @param {array} props.alertList - the current app alerts
 * @param {function} props.removeAlert - the function to remove an alert by id
*/
const AppAlerts = ({ alertList, removeAlert }) => {

	const idsToRemove = (
		alertList.length > 5
			? alertList.map(alert => alert.id).sort((a, b) => a - b).slice(0, alertList.length - 5)
			: []
	);

	return (
		<div className='app-alert'>
			{alertList.map((alert, index) =>
				<Alert
					key={alert.id}
					alert={alert}
					onClose={id => removeAlert(id)}
					isRemoved={alert.className?.includes?.('hidden') || idsToRemove.includes(alert.id)}
					hasCancelButton
				/>
			)}
		</div>
	);
};

AppAlerts.propTypes = {
	alertList: PropTypes.array.isRequired,
	removeAlert: PropTypes.func.isRequired,
};

export default AppAlerts;
