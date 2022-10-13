import { createContext } from 'react';

const AlertContext = createContext({
	/**
	 * Add new alert to the app
	 * @param {string} message - the alert message
	 * @param {'default'|'error'|'success'|'warning'|'info'|'primary'|'secondary'} [type = 'default']
	 * @param {string} [className]
	*/
	addAlert: (message, type) => {},
	/**
	 * Remove the alert given by the id
	 * @param {number} id - the id to remove0
	*/
	removeAlert: (id) => {},
});

export default AlertContext;