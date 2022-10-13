import { useContext } from 'react';
import PropTypes from 'prop-types';

import AlertContext from 'contexts/AlertContext';

import { getIdValue, getSchemaIdentifier } from 'helpers/schema';
import { humanizeString } from 'helpers/strings';
import deleteRequest from 'helpers/api/delete.api';

import Button from 'components/Button/Button';

import { ReactComponent as WarningIcon } from 'images/icons/warning.svg';
import { ReactComponent as LoadingIcon } from 'images/icons/loading.svg';

import './Delete.css';

/**
 * @param {object} props
 * @param {'login'|'client'|'user'} props.page - the current page
 * @param {object} [props.current] - the item to be deleted
 * @param {function} props.setData - the function to update current data
 * @param {boolean} props.isLoading - is the app loading something?
 * @param {function} props.setIsLoading - the function to change app loading status
 * @param {function} props.onClose - the function to call when the page closes. returns true as first parameter if deleted
*/
const Delete = ({
	page,
	current,
	setData,
	isLoading,
	setIsLoading,
	onClose,
}) => {

	const { addAlert } = useContext(AlertContext);

	const handleDelete = () => {

		if (isLoading)
			addAlert('App is busy. Please try again.', 'info');

		setIsLoading(true);

		const id = getIdValue(page, current);

		deleteRequest(`${page}s/${id}`)
			.then(() => {

				addAlert(`${humanizeString(page)} Deleted!`, 'success');
				setData([]);
				setTimeout(() => onClose(true), 500);

			})
			.catch(error => addAlert(error, 'error'))
			.finally(() => setIsLoading(false));

	};

	if (!current) {
		onClose(false);
		return null;
	}

	return (
		<div
			className='delete-page page-body'
		>

			<div className='delete-dialog'>

				<WarningIcon
					className='warning-icon'
				/>

				<p>
					You Are Deleting The {humanizeString(page)}: {getSchemaIdentifier(page, current)}
					<br />
					Please Confirm To Proceed With Deletion.
				</p>

				<div className='response-buttons'>

					<Button
						className={isLoading ? 'loading' : ''}
						color='error'
						variant='filled'
						roundCorners
						onClick={handleDelete}
					>
						{isLoading
							? (
								<LoadingIcon />
							)
							: 'Delete'
						}
					</Button>

					<Button
						color='primary'
						variant='filled'
						roundCorners
						onClick={() => onClose(false)}
					>
						Go Back
					</Button>

				</div>

			</div>

		</div>
	);
};

Delete.propTypes = {
	page: PropTypes.oneOf(['login', 'client', 'user']).isRequired,
	current: PropTypes.object,
	setData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Delete;