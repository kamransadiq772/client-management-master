import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import AlertContext from 'contexts/AlertContext';

import { getSchemaFormFields, getIdValue } from 'helpers/schema';
import { humanizeString } from 'helpers/strings';

import TextField from 'components/TextField/TextField';
import Button from 'components/Button/Button';

import { ReactComponent as CloseIcon } from 'images/icons/arrowUp.svg';
import { ReactComponent as OpenIcon } from 'images/icons/arrowDown.svg';
import { ReactComponent as ArrowRightIcon } from 'images/icons/arrowRight.svg';
import { ReactComponent as LoadingIcon } from 'images/icons/loading.svg';

import './Form.css';
import postRequest from 'helpers/api/post.api';
import putRequest from 'helpers/api/put.api';

/**
 * @param {'client'|'user'} schema - the schema to use
 * @param {object} [current] - the object with existing values
*/
const getInitialForm = (schema, current) => getSchemaFormFields(schema).reduce(
	(object, field) => ({
		...object,
		[field.id]: (
			field.type === 'object'
				? field.fields.reduce(
					(subObject, subField) => ({
						...subObject,
						[subField.id]: current?.[field.id]?.[subField.id] ?? '',
					})
					, {}
				)
				: current?.[field.id] ?? ''
		),
	})
	, {}
);

/**
 * @param {SchemaField} field - the current schema field
 * @param {any} value - the value to parse
*/
const getParsedValue = (field, value = 'int') => {

	if (typeof value === 'object')
		return value;

	else if (field.type === 'int')
		return !isNaN(parseInt(value))
			? parseInt(value)
			: null;

	else if (field.type === 'float')
		return !isNaN(parseFloat(value))
			? parseFloat(value)
			: null;

	else
		return value;

};

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaNonGroupFields = schema => getSchemaFormFields(schema).filter(field => field.type !== 'object');

/** @param {'client'|'user'} schema - the schema to use */
const getSchemaGroupFields = schema => getSchemaFormFields(schema).filter(field => field.type === 'object');

/**
 * @param {object} props
 * @param {'login'|'client'|'user'} props.page - the current page
 * @param {object} [props.current] - the current data row. the form is `Add` if current is undefined, `Edit` otherwise
 * @param {function} props.setData - the function to change data state
 * @param {boolean} props.isLoading - is the app loading something?
 * @param {function} props.setIsLoading - the function to change app loading status
 * @param {function} props.onClose - the function to call when the page closes. returns true as first parameter if deleted
*/
const Form = ({
	page,
	current,
	setData,
	isLoading,
	setIsLoading,
	onClose,
}) => {

	const { addAlert } = useContext(AlertContext);

	const [form, setForm] = useState({});
	const [hiddenSections, setHiddenSections] = useState([]);

	useEffect(() => {
		return () => {
			setHiddenSections([]);
		};
	}, []);

	useEffect(() => {
		setForm(getInitialForm(page, current));
	}, [page, current]);

	const handleSectionToggle = sectionId => (
		setHiddenSections(prevHiddenSections =>
			prevHiddenSections.some(name => name === sectionId)
				? prevHiddenSections.filter(name => name !== sectionId)
				: [
					...prevHiddenSections,
					sectionId,
				]
		)
	);

	const handleFormChange = (field, newValue, parentField) => setForm(prevForm =>
		parentField
			? {
				...prevForm,
				[parentField.id]: {
					...prevForm[parentField.id],
					[field.id]: getParsedValue(field, newValue),
				},
			}
			: {
				...prevForm,
				[field.id]: getParsedValue(field, newValue),
			}
	);

	const handleSubmit = event => {

		event.preventDefault();

		if (isLoading)
			addAlert('App is busy. Please try again.', 'info');

		const getBody = () => {
			try {

				return getSchemaFormFields(page).reduce(
					(object, field) => ({
						...object,
						[field.id]: field.getValue?.(form) ?? (
							field.type === 'object'
								? (
									field.fields.some(subField => form[field.id]?.[subField.id])
										? field.fields.reduce(
											(subObject, subField) => ({
												...subObject,
												[subField.id]: (
													form[field.id]?.[subField.id]
														? form[field.id]?.[subField.id]
														: null
												),
											}),
											{}
										)
										: null
								)
								: form[field.id]
									? form[field.id]
									: null
						)
					})
					, {}
				);

			}
			catch (error) {
				addAlert(error.toString(), 'error');
				return undefined;
			}
		};

		const body = getBody();
		if (!body) return;

		const id = getIdValue(page, current)
			, requestApi = current ? putRequest : postRequest
			, apiPath = `${page}s${current ? `/${id}` : ''}`;

		setIsLoading(true);

		requestApi(apiPath, body)
			.then(() => {
				addAlert(`${humanizeString(page)} ${current ? 'Edited' : 'Added'}!`, 'success');
				setData([]);
				setTimeout(() => onClose(true), 500);
			})
			.catch(error => addAlert(error, 'error'))
			.finally(() => setIsLoading(false));

	};

	return (
		<div
			className='form-page page-body scroll-y'
		>
			<form
				onSubmit={handleSubmit}
			>

				{getSchemaNonGroupFields(page).map(field =>
					<TextField
						key={field.id}
						label={field.label ?? humanizeString(field.id)}
						value={form[field.id] ?? ''}
						onChange={({ target }) => handleFormChange(field, target.value)}
						required={!field.canBeNull}
					/>
				)}

				{getSchemaGroupFields(page).map(field =>
					<section
						key={field.id}
						className={`section-group${hiddenSections.find(name => name === field.id) ? ' closed' : ''}`}
					>

						<h1 className='section-group-heading'>{field.label ?? humanizeString(field.id)}</h1>

						<Button
							type='button'
							className='section-group-close'
							icon={
								hiddenSections.find(name => name === field.id)
									? <OpenIcon />
									: <CloseIcon />
							}
							tooltip={
								hiddenSections.find(name => name === field.id)
									? 'Show Section'
									: 'Hide Section'
							}
							iconButton
							onClick={() => handleSectionToggle(field.id)}
						/>

						{field.fields.map(subField =>
							<TextField
								key={subField.id}
								variant='inline'
								label={subField.label ?? humanizeString(subField.id)}
								required={!subField.canBeNull}
								value={form[field.id]?.[subField.id] ?? ''}
								disabled={field.immutable && current}
								onChange={({ target }) => handleFormChange(subField, target.value, field)}
							/>
						)}

					</section>
				)}

				<Button
					color='primary'
					className={isLoading ? 'loading' : ''}
					type='submit'
					icon={isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
					iconButton={isLoading}
				>
					Submit
				</Button>

			</form>

		</div>
	);
};

Form.propTypes = {
	page: PropTypes.oneOf(['login', 'client', 'user']).isRequired,
	current: PropTypes.object,
	setData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	setIsLoading: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Form;