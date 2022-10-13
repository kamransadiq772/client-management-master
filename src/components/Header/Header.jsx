import { Fragment, useState, useEffect, } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@react-hook/media-query';

import { removeUser } from 'helpers/auth';
import { humanizeString } from 'helpers/strings';

import SearchBar from 'components/SearchBar/SearchBar';
import Button from 'components/Button/Button';

import { ReactComponent as WiMetrixLogo } from 'images/logo.svg';
import { ReactComponent as AddIcon } from 'images/icons/add.svg';
import { ReactComponent as ClientIcon } from 'images/icons/user.svg';
import { ReactComponent as UserIcon } from 'images/icons/user.svg';
import { ReactComponent as PaginationIcon } from 'images/icons/pagination.svg';
import { ReactComponent as NoPaginationIcon } from 'images/icons/noPagination.svg';
import { ReactComponent as BackIcon } from 'images/icons/arrowLeft.svg';
import { ReactComponent as EditIcon } from 'images/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'images/icons/delete.svg';
import { ReactComponent as DarkModeIcon } from 'images/icons/darkMode.svg';
import { ReactComponent as LightModeIcon } from 'images/icons/lightMode.svg';
import { ReactComponent as LogoutIcon } from 'images/icons/logout.svg';
import { ReactComponent as LoadingIcon } from 'images/icons/loading.svg';
import { ReactComponent as MenuIcon } from 'images/icons/menu.svg';
import { ReactComponent as CloseIcon } from 'images/icons/error.svg';

import './Header.css';

/**
 * @param {object} props
 * @param {boolean} props.isLoading - is the app loading something?
 * @param {object} [props.currentClient] - currently selected client
 * @param {'login'|'client'|'user'} props.currentPage - current application page
 * @param {'list'|'add'|'edit'|'details'|'delete'} props.currentPageView - current application view
 * @param {string} props.searchString - the current value of search
 * @param {function} props.setSearchString - the setter function for search
 * @param {function} props.onPageChange - the callback function for page navigation
 * @param {function} props.onPageViewChange - the callback function for change page views
 * @param {boolean} props.isDarkTheme - is the app using dark theme?
 * @param {function} props.setIsDarkTheme - the setter function to change the app theme
 * @param {'show'|'hide'|'hiding'} props.paginationStatus - the current pagination status
 * @param {function} props.setPaginationStatus - the setter function to update pagination status
*/
const Header = ({
	isLoading,
	currentClient,
	currentPage,
	currentPageView,
	searchString,
	setSearchString,
	onPageChange,
	onPageViewChange,
	isDarkTheme,
	setIsDarkTheme,
	paginationStatus,
	setPaginationStatus,
}) => {

	const isSmallerScreen = useMediaQuery('only screen and (max-width: 1000px)');

	const [isShowingMenu, setIsShowingMenu] = useState(false);

	useEffect(() => {
		return () => {
			setIsShowingMenu(false);
		};
	}, []);

	const paginationMap = {
		hide: 'show',
		hiding: 'hiding',
		show: 'hiding',
	};

	const navigationItems = [
		//! Left Navigation
		{
			id: 'loading',
			isShowing: isLoading,
			position: 'left',
			component: (
				<LoadingIcon
					className='header-loading'
				/>
			),
		},
		{
			id: 'add',
			isShowing: currentPageView !== 'add',
			position: 'left',
			props: {
				color: 'success',
				icon: <AddIcon />,
				tooltip: 'Add',
				onClick: () => onPageViewChange('add'),
			},
		},
		{
			id: 'client',
			isShowing: currentPage !== 'client',
			position: 'left',
			props: {
				color: 'warning',
				icon: <ClientIcon />,
				tooltip: 'Clients',
				onClick: () => onPageChange('client'),
			},
		},
		{
			id: 'user',
			isShowing: currentPage !== 'user',
			position: 'left',
			props: {
				color: 'warning',
				icon: <UserIcon />,
				tooltip: 'Users',
				onClick: () => onPageChange('user'),
			},
		},

		//! Right Navigation
		{
			id: 'search',
			isShowing: currentPageView === 'list',
			position: 'right',
			component: (
				<SearchBar
					searchString={searchString}
					setSearchString={setSearchString}
				/>
			)
		},
		{
			id: 'pagination',
			isShowing: currentPageView === 'list',
			position: 'right',
			props: {
				color: 'success',
				icon: paginationStatus !== 'hide' ? <NoPaginationIcon /> : <PaginationIcon />,
				tooltip: `${paginationStatus !== 'hide' ? 'Remove' : 'Add'} Pagination`,
				onClick: () => setPaginationStatus(prevPaginationStatus => {

					if (paginationMap[prevPaginationStatus] === 'hiding')
						setTimeout(() => setPaginationStatus('hide'), 200);
					return paginationMap[prevPaginationStatus];

				}),
			},
		},
		{
			id: 'back',
			isShowing: currentPageView !== 'list',
			position: 'right',
			props: {
				color: 'secondary',
				icon: <BackIcon />,
				tooltip: 'Go Back',
				onClick: () => onPageViewChange('list'),
			},
		},
		{
			id: 'edit',
			isShowing: currentPageView === 'details',
			position: 'right',
			props: {
				color: 'info',
				icon: <EditIcon />,
				tooltip: 'Edit',
				onClick: () => onPageViewChange('edit'),
			},
		},
		{
			id: 'delete',
			isShowing: currentPageView === 'details',
			position: 'right',
			props: {
				color: 'error',
				icon: <DeleteIcon />,
				tooltip: `Delete`,
				onClick: () => onPageViewChange('delete'),
			},
		},
		{
			id: 'logout',
			isShowing: true,
			position: 'right',
			props: {
				color: 'error',
				icon: <LogoutIcon />,
				tooltip: 'Logout',
				onClick: removeUser,
			},
		},
		{
			id: 'switchTheme',
			isShowing: true,
			position: 'right',
			props: {
				color: 'secondary',
				icon: isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />,
				tooltip: `${isDarkTheme ? 'Light' : 'Dark'} Mode`,
				onClick: () => setIsDarkTheme(prevIsDarkTheme => !prevIsDarkTheme),
			},
		},
	];

	const showingNavigationItems = navigationItems.filter(item => item.isShowing);

	/**
	 * Get Navigation items
	 * @param {'left'|'right'} [position] - the position of the navigation. Sends all items if none is specified
	 * @returns {ReactComponent[]} current navigation items
	*/
	const getNavigation = position => (
		showingNavigationItems
			.filter(item => !position || position === item.position)
			.map(item =>
				item.component
					? (
						<Fragment
							key={item.id}
						>
							{item.component}
						</Fragment>
					)
					: (
						<Button
							key={item.id}
							{...item.props}
							tooltipPlacement='bottom'
							iconButton
						/>
					)
			)
	);

	const pageLabels = {
		list: `${humanizeString(currentPage)}s`,
		add: `Add ${humanizeString(currentPage)}`,
		edit: `Edit ${humanizeString(currentPage)}`,
		details: `${humanizeString(currentPage)} Details`,
		delete: `Delete ${humanizeString(currentPage)}`,
	};

	return (
		<header className='header'>

			<div className='header-left'>

				<WiMetrixLogo className='wimetrix-logo' />

				{!isSmallerScreen && getNavigation('left')}

				{pageLabels[currentPageView] &&
					<h2
						className='page-label'
					>
						{pageLabels[currentPageView]}
					</h2>
				}

			</div>

			<div className='header-right'>

				{(isSmallerScreen && showingNavigationItems.length > 0) &&
					<Button
						color='secondary'
						tooltip='Menu'
						tooltipPlacement='bottom'
						icon={<MenuIcon />}
						iconButton
						onClick={() => setIsShowingMenu(prevIsShowingMenu => !prevIsShowingMenu)}
					/>
				}

				{!isSmallerScreen && getNavigation('right')}

			</div>

			{(isSmallerScreen && showingNavigationItems.length > 0) &&
				<aside
					className={`header-drawer${isShowingMenu ? ' showing' : ''}`}
				>

					{getNavigation()}

					<Button
						color='error'
						tooltip='Hide'
						tooltipPlacement='bottom'
						icon={<CloseIcon />}
						iconButton
						onClick={() => setIsShowingMenu(false)}
					/>

				</aside>
			}

		</header>
	);
};

Header.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	currentClient: PropTypes.object,
	currentPage: PropTypes.oneOf(['login', 'client', 'user']).isRequired,
	currentPageView: PropTypes.oneOf(['list', 'add', 'edit', 'details', 'delete']).isRequired,
	searchString: PropTypes.string.isRequired,
	setSearchString: PropTypes.func.isRequired,
	onPageChange: PropTypes.func.isRequired,
	isDarkTheme: PropTypes.bool.isRequired,
	setIsDarkTheme: PropTypes.func.isRequired,
	paginationStatus: PropTypes.oneOf(['show', 'hide', 'hiding']).isRequired,
	setPaginationStatus: PropTypes.func.isRequired,
};

export default Header;