//@ts-check

/**
 * @typedef {object} DropdownOption
 * @property {string} DropdownOption.value - value of the dropdown option
 * @property {string} DropdownOption.label - label of the dropdown option
*/

/**
 * @typedef {object} SchemaField
 * @property {string} SchemaField.id - id of the field
 * @property {('string'|'int'|'float'|'boolean'|'date'|'time'|'datetime'|'image'|'password'|'dropdown'|'object')} SchemaField.type - the field's data type
 * @property {string} [SchemaField.label] - label of the field
 * @property {boolean} [SchemaField.hidden] - should the field be hidden in all forms and views?
 * @property {boolean} [SchemaField.identifier] - is this field the identifier for this schema?
 * @property {boolean} [SchemaField.immutable] - is this field immutable?
 * @property {boolean} [SchemaField.noAdd] - can the field's value be added from the Add screen?
 * @property {boolean} [SchemaField.noUpdate] - can the field's value be updated from the Update screen?
 * @property {boolean} [SchemaField.noView] - should the field be visible on views?
 * @property {boolean} [SchemaField.isPrimaryKey] - is the field primary key in the database?
 * @property {boolean} [SchemaField.canBeNull] - can the field's value be null?
 * @property {boolean} [SchemaField.frontendOnly] - should the field be excluded from api request body?
 * @property {function} [SchemaField.getValue] - function to calculate and return the value current field. used for fields whose value is calculated and not entered
 *
 * @property {object} [SchemaField.formFieldProps] - the props object to be passed to the form field component
 * @property {(number|function)} [SchemaField.formFieldProps.min] - the minimum number value for the field
 * @property {(number|function)} [SchemaField.formFieldProps.max] - the maximum number value for the field
 * @property {(number|function)} [SchemaField.formFieldProps.minLength] - the lower character limit for the text field
 * @property {(number|function)} [SchemaField.formFieldProps.maxLength] - the upper character limit for the text field
 * @property {RegExp} [SchemaField.formFieldProps.pattern] - the Regular Expression Validation Pattern
 * @property {boolean} [SchemaField.formFieldProps.readOnly] - is the field's form field read only?
 * @property {'text'|'number'|'date'|'email'|'password'|'search'|'tel'|'time'|'datetime-local'|'range'|'color'|'url'|'week'} [SchemaField.formFieldProps.type] - the type of the text input
 *
 * @property {object} [SchemaField.dropdown] - the details for the field's dropdown, exclude if no dropdown
 * @property {function} [SchemaField.dropdown.getValue] - function to calculate and return the value for the dropdown by selected option
 * @property {function} [SchemaField.dropdown.getLabel] - function to calculate and return the label for the dropdown by selected option
 *
 * @property {DropdownOption[] | string[]} [SchemaField.dropdown.options] - predetermined option values for the dropdown, exclude if dropdown.api is defined
 * @property {function} [SchemaField.dropdown.filter] - function to filter the dropdown options by the current state
 * @property {object} [SchemaField.dropdown.api] - the dropdown API details. exclude if dropdown.values is defined
 * @property {string} SchemaField.dropdown.api.path - the path of the API
 * @property {function} [SchemaField.dropdown.api.getParams] - function to calculate and return the parameter string
 * @property {function} [SchemaField.dropdown.api.responseMap] - function to map the API response
 *
 * @property {SchemaField[]} [SchemaFiled.fields] - the sub-fields of a group type field
 *
*/

/**
 * @typedef {object} SchemaObject
 * @property {string} SchemaObject.name - schema's name
 * @property {SchemaField[]} SchemaObject.fields - list of fields in the current schema
*/

class Schema {

	/**
	 * Class Constructor
	 * @param {SchemaObject} schema
	*/
	constructor(schema) {
		this.schema = schema;
	}

};

export default Schema;