import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getSchemaIdentifier, getSchemaViewFields } from 'helpers/schema';
import { humanizeString } from 'helpers/strings';

import Button from 'components/Button/Button'; import CopyButton from 'components/Button/CopyButton';

import { ReactComponent as CloseIcon } from 'images/icons/arrowUp.svg';
import { ReactComponent as OpenIcon } from 'images/icons/arrowDown.svg';

import './Details.css';

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaNonGroupFields = schema => getSchemaViewFields(schema).filter(field => field.type !== 'object' && !field.identifier);

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaGroupFields = schema => getSchemaViewFields(schema).filter(field => field.type === 'object');

/** @param {'client'|'user'} schema - the schema to use */
const getSections = schema => getSchemaGroupFields(schema).map(field => ({
	id: field.id,
	name: field.label ?? humanizeString(field.id),
	details: field.fields.map(subField => ({
		id: subField.id,
		label: subField.label ?? humanizeString(subField.id),
	}))
}));

const DetailItem = ({ current, detail, hasCopyButton, }) => {
	return (
		<div
			key={detail.id}
			className='detail-container'
		>

			<div
				className='detail-heading'
			>
				{detail.label ?? humanizeString(detail.id)}
			</div>
			<div
				className='detail-value'
			>

				{current?.[detail.id] ?? ''}

				{(hasCopyButton && current?.[detail.id]) &&
					<CopyButton
						className='detail-value-copy'
						toCopy={current?.[detail.id]?.toString?.() ?? ''}
					/>
				}

			</div>

		</div>
	);
};

/**
 * @param {object} props
 * @param {'login'|'client'|'user'} props.page - the current page
 * @param {object} [props.current] - the current object
*/
const Details = ({
	page,
	current,
}) => {

	const [hiddenSections, setHiddenSections] = useState([]);

	useEffect(() => {
		return () => {
			setHiddenSections([]);
		};
	}, []);

	const handleSectionToggle = sectionName => (
		setHiddenSections(prevHiddenSections =>
			prevHiddenSections.some(name => name === sectionName)
				? prevHiddenSections.filter(name => name !== sectionName)
				: [
					...prevHiddenSections,
					sectionName,
				]
		)
	);

	return (
		<div
			className='detail-page page-body scroll-y'
		>

			<h1 className='detail-page-heading'>{getSchemaIdentifier(page, current)}</h1>

			{getSchemaNonGroupFields(page).length > 0 &&
				<section
					className='section-group'
				>
					{getSchemaNonGroupFields(page).map(detail =>
						<DetailItem
							key={detail.id}
							current={current}
							detail={detail}
							hasCopyButton={page === 'client'}
						/>
					)}

				</section>
			}

			{getSections(page).map(section =>
				<section
					key={section.name}
					className={`section-group${hiddenSections.find(name => name === section.name) ? ' closed' : ''}`}
				>

					<h1 className='section-group-heading'>{section.name}</h1>

					<Button
						className='section-group-close'
						icon={
							hiddenSections.find(name => name === section.name)
								? <OpenIcon />
								: <CloseIcon />
						}
						tooltip={
							hiddenSections.find(name => name === section.name)
								? 'Show Section'
								: 'Hide Section'
						}
						iconButton
						onClick={() => handleSectionToggle(section.name)}
					/>

					{section.details.map(detail =>
						<DetailItem
							key={detail.id}
							current={current[section.id]}
							detail={detail}
							hasCopyButton={page === 'client'}
						/>
					)}

				</section>
			)}

		</div>
	);
};

Details.propTypes = {
	page: PropTypes.oneOf(['login', 'client', 'user']).isRequired,
	current: PropTypes.object,
};

export default Details;