import { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@react-hook/media-query';

import useCompare from 'hooks/useCompare';

import AlertContext from 'contexts/AlertContext';

import { humanizeString } from 'helpers/strings';
import { getIdValue, getSchemaViewFields } from 'helpers/schema';
import getRequest from 'helpers/api/get.api';

import Pagination from 'components/Pagination/Pagination';
import Tooltip from 'components/Tooltip/Tooltip';
import Button from 'components/Button/Button';
import CopyButton from 'components/Button/CopyButton';

import { ReactComponent as LoadingIcon } from 'images/icons/loading.svg';
import { ReactComponent as ViewIcon } from 'images/icons/view.svg';
import { ReactComponent as EditIcon } from 'images/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'images/icons/delete.svg';

import './View.css';

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaNonGroupFields = schema => getSchemaViewFields(schema).filter(field => field.type !== 'object');

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaGroupFields = schema => getSchemaViewFields(schema).filter(field => field.type === 'object');

/** @param {'client'|'user'} schema - the schema to use */
const getNonGroupColumns = schema => (
	getSchemaNonGroupFields(schema).map(field => ({
		...field,
		thClass: field.identifier ? 'name-header' : undefined,
		tdClass: field.identifier ? 'name-cell' : undefined,
	}))
);

/**
 * @param {'client'|'user'} schema - the schema to use
 * @param {boolean} isSmallerScreen - is the screen small?
*/
const getGroupColumns = (schema, isSmallerScreen) => {

	if (isSmallerScreen) return [];

	return getSchemaGroupFields(schema).map(field => ({
		...field,
		getCell: row => (
			<div
				className='td-detail-container'
			>
				{field.fields
					.filter(subField => row[field.id]?.[subField.id])
					.map(subField =>
						<div
							key={`${field.id}${subField.id}${getIdValue(row)}`}
							className={`td-detail`}
						>
							<p>
								{row[field.id]?.[subField.id]}
							</p>
							<Tooltip>{subField.label ?? humanizeString(subField.id)}</Tooltip>
							<CopyButton
								toCopy={row[field.id]?.[subField.id]?.toString?.() ?? ''}
							/>
						</div>
					)
				}
			</div>
		),
	}));

};

/**
 * @param {object} props
 * @param {'login'|'client'|'user'} props.page - the array containing current clients
 * @param {object[]} props.data - the array containing current data
 * @param {function} props.setData - the function to change data state
 * @param {boolean} props.isLoading - is the page currently loading
 * @param {function} props.setIsLoading - the function to change loading state
 * @param {function} props.onViewAction - the function to call when a view action is triggered
 * @param {'show'|'hide'|'hiding'} props.paginationStatus - the current pagination status
*/
const View = ({
	page,
	data,
	setData,
	isLoading,
	setIsLoading,
	onViewAction,
	paginationStatus,
}) => {

	const { addAlert } = useContext(AlertContext);

	const isSmallerScreen = useMediaQuery('only screen and (max-width: 1000px)');

	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const fetchData = useCallback(
		() => {

			setIsLoading(true);

			getRequest(`${page}s`)
				.then(loadedData => setData(loadedData))
				.catch(error => {
					addAlert(error, 'error');
					setData([]);
				})
				.finally(() => setIsLoading(false));


		},
		[page, addAlert, setIsLoading, setData]
	);

	useEffect(() => fetchData(), [fetchData]);

	const hasDataChanged = useCompare(data);
	useEffect(() => {
		if (hasDataChanged) setCurrentPage(1);
	}, [hasDataChanged]);

	const handlePageChange = newPage => {
		setCurrentPage(newPage);
	};

	const handleRowsPerPageChange = ({ target }) => {
		setRowsPerPage(parseInt(target.value, 10));
		setCurrentPage(1);
	};

	const actionsButtons = [
		{ id: 'view', color: 'success', icon: <ViewIcon />, },
		{ id: 'edit', color: 'info', icon: <EditIcon />, },
		{ id: 'delete', color: 'error', icon: <DeleteIcon />, },
	];

	const columns = [
		{
			id: 'number',
			label: 'No.',
			thClass: 'index-header',
			getCell: row => data.indexOf(row) + 1,
		},
		...getNonGroupColumns(page),
		...getGroupColumns(page, isSmallerScreen),
		{
			id: 'actions',
			thClass: 'action-header',
			getCell: row => (
				<div className='action-container'>
					{actionsButtons.map(action =>
						<Button
							key={action.id}
							color={action.color}
							className='action-icon'
							icon={action.icon}
							onClick={() => onViewAction(action.id, row)}
							tooltip={humanizeString(action.id)}
							iconButton
						/>
					)}
				</div>
			),
		},
	];

	const dataToUse = (
		paginationStatus !== 'hide'
			? data.slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage)
			: data
	);

	const getBodyCellContents = (row, rowIndex, column) => {

		if (column.getCell)
			return column.getCell(row, rowIndex);

		else if (column.type === 'boolean' || typeof row[column.id] === 'boolean')
			return row[column.id] ? 'Yes' : 'No';

		return row[column.id] ?? '';

	};

	return (
		<div
			className={`page-body view-page scroll-y${isLoading ? ' loading' : ''}`}
		>
			{isLoading
				? <LoadingIcon className='loading-icon' />
				: (
					<table
						className='table-container'
					>

						<thead
							className='table-header'
						>
							<tr
								className='table-row'
							>

								{columns.map(column =>
									<th
										key={column.id}
										className={`table-cell${column.thClass ? ` ${column.thClass}` : ''}`}
									>
										{column.label ?? humanizeString(column?.id ?? '')}
									</th>
								)}

							</tr>
						</thead>

						<tbody
							className='table-body'
						>
							{dataToUse.map((row, index) =>
								<tr
									key={index}
									className='table-row'
								>

									{columns.filter(column => !column.hidden).map(column =>
										<td
											key={`row-${index}-${column.id}`}
											className={`table-cell${column.tdClass ? ` ${column.tdClass}` : ''}`}
										>
											{getBodyCellContents(row, index, column)}
										</td>
									)}

								</tr>
							)}
						</tbody>

						{paginationStatus !== 'hide' &&
							<tfoot
								className={`table-pagination${paginationStatus === 'hiding' ? ' hiding' : ''}`}
							>
								<tr
									className='table-row'
								>
									<td
										colSpan={columns.filter(column => !column.hidden).length}
									>
										<Pagination
											count={data.length}
											rowsPerPage={rowsPerPage}
											page={currentPage}
											onPageChange={handlePageChange}
											onRowsPerPageChange={handleRowsPerPageChange}
										/>
									</td>
								</tr>
							</tfoot>
						}

					</table>
				)
			}
		</div>
	);
};

View.propType = {
	page: PropTypes.oneOf(['login', 'client', 'user']).isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	setData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	onViewRow: PropTypes.func.isRequired,
	onEditRow: PropTypes.func.isRequired,
	onDeleteRow: PropTypes.func.isRequired,
	paginationStatus: PropTypes.oneOf(['show', 'hide', 'hiding']).isRequired,
};

export default View;