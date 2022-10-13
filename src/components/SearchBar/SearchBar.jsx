import { useState, useEffect } from 'react';
import Button from 'components/Button/Button';
import PropTypes from 'prop-types';

import { ReactComponent as SearchIcon } from 'images/icons/search.svg';
import { ReactComponent as CloseIcon } from 'images/icons/error.svg';

import './SearchBar.css';
import TextField from 'components/TextField/TextField';
import useCompare from 'hooks/useCompare';

/**
 * @param {object} props
 * @param {string} props.searchString - the current value of search
 * @param {function} props.setSearchString - the setter function for search
*/
const SearchBar = ({ searchString, setSearchString }) => {


	const [status, setStatus] = useState('minimized');

	useEffect(() => {
		return () => {
			setStatus('minimized');
		};
	}, []);

	const hasStatusChanged = useCompare(status);

	useEffect(() => {
		if (hasStatusChanged && status === 'minimizing')
			setTimeout(
				() => setStatus('minimized')
				, 200
			);
	}, [status, hasStatusChanged]);

	return (
		<div
			className='search-bar'
		>

			<Button
				color='info'
				icon={status === 'expanded' ? <CloseIcon /> : <SearchIcon />}
				tooltip='Search'
				tooltipPlacement='bottom'
				onClick={() => setStatus(prevStatus => prevStatus === 'minimized' ? 'expanded' : 'minimizing')}
				iconButton
			/>

			{status !== 'minimized' &&
				<TextField
					className={status === 'minimizing' ? 'hide-search' : ''}
					type='search'
					variant='placeholderLabel'
					label='Search'
					value={searchString}
					onChange={({ target }) => setSearchString(target.value)}
					inputProps={{
						autoFocus: true,
					}}
				/>
			}

		</div>
	);
};

SearchBar.propTypes = {
	searchString: PropTypes.string.isRequired,
	setSearchString: PropTypes.func.isRequired,
};

export default SearchBar;