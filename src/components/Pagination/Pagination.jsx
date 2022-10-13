import { Fragment, useState, useEffect, } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@react-hook/media-query';

import useCompare from 'hooks/useCompare';

import { paginationSizes } from 'config/config';

import Button from 'components/Button/Button';
import Dropdown from 'components/Dropdown/Dropdown';
import TextField from 'components/TextField/TextField';

import { ReactComponent as LastPageIcon } from 'images/icons/arrowLeft.svg';
import { ReactComponent as NextPageIcon } from 'images/icons/arrowRight.svg';

import './Pagination.css';

/**
 * @param {object} props - the props object
 * @param {number} props.count - the row count
 * @param {number} [props.rowsPerPage] - the number of rows per page
 * @param {number} [props.page] - the current page
 * @param {function} [props.onPageChange] - the function to call when page changes
 * @param {function} [props.onRowsPerPageChange] - the function to call when rows per page change
*/
const Pagination = ({
	count,
	rowsPerPage,
	page,
	onPageChange,
	onRowsPerPageChange,
}) => {

	const isSmallerScreen = useMediaQuery('only screen and (max-width: 1000px)');

	const [newPage, setNewPage] = useState(page);
	const [pages, setPages] = useState([]);

	useEffect(() => {
		setNewPage(page);
	}, [page]);

	const pageStart = (
		count === 0
			? 0
			: parseInt((page - 1) * rowsPerPage + 1)
	);

	const pageEnd = (
		(pageStart + rowsPerPage) > count
			? count
			: (pageStart + rowsPerPage - 1)
	);

	const totalPages = Math.ceil(count / rowsPerPage);

	const hasNewPageChanged = useCompare(newPage);

	useEffect(() => {

		if (hasNewPageChanged && newPage >= 1 && newPage <= totalPages)
			onPageChange(newPage);

	}, [newPage, hasNewPageChanged, onPageChange, pages, totalPages]);

	useEffect(() => {

		if (isSmallerScreen) return setPages([]);

		setPages(
			[...new Set([
				1,
				2,
				totalPages - 1,
				totalPages,
				...[...Array(5).keys()].map(current => (current + 1) + (page - 3))
			])].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b)
		);

	}, [count, rowsPerPage, page, onPageChange, onRowsPerPageChange, totalPages, isSmallerScreen]);

	return (
		<div className='pagination-container'>

			{!isSmallerScreen &&
				<div className='pagination-status'>
					<b>{pageStart}-{pageEnd}</b>
					<span> of </span>
					<b>{count}</b>
				</div>
			}

			<Dropdown
				className='pagination-size'
				variant='inline'
				label='Size'
				options={paginationSizes.map(size => size.toString())}
				onChange={onRowsPerPageChange}
				value={rowsPerPage.toString()}
			/>

			{!isSmallerScreen &&
				<TextField
					variant='inline'
					type='number'
					label='Page'
					value={newPage.toString()}
					onChange={({ target }) => setNewPage(parseInt(target.value))}
					inputProps={{
						min: 1,
						max: totalPages,
						size: totalPages.toString().length,
					}}
				/>
			}

			{(totalPages !== 0 && page !== 1) &&
				<Button
					color='primary'
					onClick={() => onPageChange(page - 1)}
					icon={<LastPageIcon />}
					iconButton
				/>
			}

			{pages.map((number, index) =>
				<Fragment key={number}>

					<Button
						className={number === page ? 'active' : undefined}
						color='primary'
						onClick={() => onPageChange(number)}
					>
						{number.toString()}
					</Button>

					{(
						number !== 1
						&& number !== totalPages
						&& pages[index + 1] !== number + 1
					) &&
						<span
							className='pagination-divider'
						>
							...
						</span>
					}

				</Fragment>
			)}

			{isSmallerScreen &&
				<Dropdown
					variant='inline'
					type='number'
					value={newPage?.toString?.()}
					getOptionLabel={option => `${option} / ${totalPages}`}
					options={[...Array(totalPages).keys()].map(index => (index + 1).toString())}
					onChange={({ target }) => setNewPage(parseInt(target.value))}
					inputProps={{
						min: 1,
						max: totalPages,
						size: totalPages.toString().length,
					}}
				/>
			}

			{(totalPages !== 0 && page !== totalPages) &&
				<Button
					color='primary'
					onClick={() => onPageChange(page + 1)}
					icon={<NextPageIcon />}
					iconButton
				/>
			}

		</div>
	);
};

Pagination.propTypes = {
	count: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	page: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	onRowsPerPageChange: PropTypes.func.isRequired,
};

export default Pagination;