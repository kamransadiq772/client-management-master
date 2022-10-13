import React, { useState, useEffect, useCallback } from 'react';

import AlertContext from 'contexts/AlertContext';

import { getUser } from 'helpers/auth';

import AppContainer from 'containers/AppContainer';

import AppAlerts from 'components/Alert/AppAlerts';

const getAlertId = alertList => Math.max(...alertList.map(alert => alert.id), 0) + 1;

const App = () => {

	const [isDarkTheme, setIsDarkTheme] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
	const [user, setUser] = useState(getUser());
	const [alertList, setAlertList] = useState([]);

	useEffect(() => {

		const handleLocalStorageChange = () => {
			const newUser = getUser();
			setUser(newUser);
		};

		window.addEventListener('storage', handleLocalStorageChange);

		return () => window.removeEventListener('storage', handleLocalStorageChange);

	}, []);

	useEffect(() => {

		if (isDarkTheme) {
			document.body.classList.add('dark-mode');
			document.body.classList.remove('light-mode');
		}
		else {
			document.body.classList.add('light-mode');
			document.body.classList.remove('dark-mode');
		}

	}, [isDarkTheme]);

	/**
	 * Add new alert to the app
	 * @param {string} message - the alert message
	 * @param {'default'|'error'|'success'|'warning'|'info'|'primary'|'secondary'} [type = 'default']
	 * @param {string} [className]
	*/
	const addAlert = useCallback(
		(message, type = 'default', className) => {

			setAlertList(prevAlertList => {

				const id = getAlertId(prevAlertList);

				setTimeout(
					() => setAlertList(prevAlertList =>
						prevAlertList.some(alert => alert.id === id)
							? prevAlertList.map(alert =>
								alert.id === id
									? {
										...alert,
										className: 'hidden',
									}
									: alert
							)
							: prevAlertList
					)
					, 2000
				);

				return [
					...prevAlertList,
					{ id, message, type, className, },
				];

			});

		},
		[],
	);

	/**
	 * Remove the alert given by the id
	 * @param {number} id - the id to remove0
	*/
	const removeAlert = useCallback(
		id => setAlertList(prevAlertList => prevAlertList.filter(alert => alert.id !== id)),
		[],
	);

	return (
		<AlertContext.Provider value={{ addAlert, removeAlert }}>

			<AppContainer
				isDarkTheme={isDarkTheme}
				setIsDarkTheme={setIsDarkTheme}
				user={user}
			/>

			<AppAlerts
				alertList={alertList}
				removeAlert={removeAlert}
			/>

		</AlertContext.Provider>
	);
};

export default App;
