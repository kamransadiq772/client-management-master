import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getSchemaFields } from 'helpers/schema';

import Login from './pages/Login';
import View from './pages/View';
import Form from './pages/Form';
import Delete from './pages/Delete';
import Details from './pages/Details';
import Signup from './pages/Signup';

import Header from 'components/Header/Header';

import './AppContainer.css';

/**
 * @param {object} props
 * @param {boolean} props.isDarkTheme - is the app using dark theme?
 * @param {function} props.setIsDarkTheme - the setter function to change the app theme
 * @param {object} [props.user] - the current user
*/
const AppContainer = ({ isDarkTheme, setIsDarkTheme, user }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState('client');
	const [currentPageView, setCurrentPageView] = useState('list');
	const [data, setData] = useState([]);
	const [currentRow, setCurrentRow] = useState(null);
	const [searchString, setSearchString] = useState('');
	const [paginationStatus, setPaginationStatus] = useState('show');

	// TODO Commented Out To Avoid Reloading The Application State On Change, Uncomment Before Going To Production.
	// // useEffect(() => {
	// // 	return () => {
	// // 		setIsLoading(false);
	// // 		setCurrentPage('client');
	// //		setCurrentPageView('list');
	// // 		setData([]);
	// // 		setCurrentRow(null);
	// // 		setSearchString('');
	// // 		setPaginationStatus('show');
	// // 	};
	// // }, []);

	useEffect(() => {

		if (!user && currentPage !== 'login') {
			handlePageChange('login');
		}
		else if (user && currentPage === 'login') {
			handlePageChange('client');
		}

	}, [user, currentPage]);

	/** @param {'login'|'client'|'user'} newPage */
	const handlePageChange = newPage => {

		setData([]);
		setCurrentRow(null);
		setCurrentPageView('list');
		setCurrentPage(newPage);

	};

	/** @param {'list'|'details'|'add'|'edit'|'delete'} newPageView */
	const handlePageViewChange = newPageView => {

		setCurrentPageView(newPageView);

		if (['details', 'edit', 'delete'].includes(currentPageView) && newPageView === 'view')
			setCurrentRow(null);

	};

	/**
	 * Handle Actions On View Page
	 * @param {'view'|'add'|'edit'|'delete'} newViewAction
	 * @param {object} [newCurrentRow] - the currently selected item, sent with all actions except add
	*/
	const handleViewAction = (newViewAction, newCurrentRow) => {

		const actionViewMap = {
			view: 'details',
			add: 'add',
			edit: 'edit',
			delete: 'delete',
		};

		if (newViewAction !== 'add')
			setCurrentRow(newCurrentRow);

		handlePageViewChange(actionViewMap[newViewAction]);

	};

	const getSearchCurrentValue = (row, field) => (
		field.viewValue?.(row)?.toString() ?? (
			field.type === 'boolean'
				? row[field.id] ? 'Yes' : 'No'
				: row[field.id]?.toString() ?? ''
		)
	);

	const filteredData = (
		searchString
			? data.filter(row =>
				getSchemaFields(currentPage)
					.some(field =>
						getSearchCurrentValue(row, field).toLowerCase().includes(searchString)
					)
			)
			: data
	);

	const pages = [
		{
			id: 'login',
			isShowing: currentPage === 'login',
			containerClass: 'login',
			content: (
				<Login
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					isDarkTheme={isDarkTheme}
					setIsDarkTheme={setIsDarkTheme}
				/>
			),
		},
		{
			id: 'list',
			isShowing: currentPage !== 'login' && currentPageView === 'list',
			content: (
				<View
					page={currentPage}
					data={filteredData}
					setData={setData}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					paginationStatus={paginationStatus}
					onViewAction={handleViewAction}
				/>
			)
		},
		{
			id: 'details',
			isShowing: currentPage !== 'login' && currentPageView === 'details',
			content: (
				<Details
					page={currentPage}
					current={currentRow}
				/>
			),
		},
		{
			id: 'form',
			isShowing: !['login', 'user'].includes(currentPage) &&['add', 'edit'].includes(currentPageView),
			containerClass: 'form',
			content: (
				<Form
					page={currentPage}
					current={currentRow}
					setData={setData}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					onClose={() => handlePageViewChange('list')}
				/>
			),
		},
		{
			id: 'delete',
			isShowing: currentPage !== 'login' && currentPageView === 'delete',
			content: (
				<Delete
					page={currentPage}
					current={currentRow}
					setData={setData}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					onClose={() => handlePageViewChange('list')}
				/>
			),
		},
		{
			id: 'signup',
			isShowing: currentPage === 'user' && ['add', 'edit'].includes(currentPageView),
			containerClass: 'signup',
			content: (
				<Signup
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					isDarkTheme={isDarkTheme}
					setIsDarkTheme={setIsDarkTheme}
					onClose={() => handlePageViewChange('list')}
					currentUser={currentPageView === 'edit' ? currentRow : undefined}
				/>
			),
		},
	];

	const appContainerClass = pages.find(page => page.isShowing)?.containerClass ?? currentPageView;

	return (
		<main
			className={`app-container ${appContainerClass}`}
		>

			{pages.map(page =>
				<div
					key={page.id}
					className={`page-container ${page.id}-container scroll-y`}
				>
					{page.isShowing &&
						<>
							{(currentPage !== 'login' && (currentPage !== 'user' || !['add', 'edit'].includes(currentPageView))) &&
								<Header
									isLoading={isLoading}
									setIsLoading={setIsLoading}
									currentRow={currentRow}
									currentPage={currentPage}
									currentPageView={currentPageView}
									searchString={searchString}
									setSearchString={setSearchString}
									onPageChange={handlePageChange}
									onPageViewChange={handlePageViewChange}
									isDarkTheme={isDarkTheme}
									setIsDarkTheme={setIsDarkTheme}
									paginationStatus={paginationStatus}
									setPaginationStatus={setPaginationStatus}
								/>
							}

							{page.content}
						</>
					}
				</div>
			)}
		</main>
	);
};

AppContainer.propTypes = {
	isDarkTheme: PropTypes.bool.isRequired,
	setIsDarkTheme: PropTypes.func.isRequired,
	user: PropTypes.object,
};

export default AppContainer;