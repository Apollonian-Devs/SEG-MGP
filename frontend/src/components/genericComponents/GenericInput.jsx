import React, { forwardRef } from 'react';

/**
 * @component
 * GenericInput - A customizable input component that handles different input types (e.g., text, checkbox, file) with flexible styling and validation.
 *
 * @props
 * - id (string): The ID for the input element, used for the label association.
 * - label (string): The label for the input field.
 * - labelClassName (string): Custom CSS class for styling the label (default is 'flex text-sm text-left font-medium text-black').
 * - type (string): The type of input (e.g., 'text', 'checkbox', 'file').
 * - required (boolean): Indicates whether the input is required (default is false).
 * - checked (boolean): The checked state for checkbox inputs.
 * - onChange (function): The function to handle input changes.
 * - placeholder (string): The placeholder text for the input (default is '').
 * - multiple (boolean): Whether the input supports multiple file selection (default is false).
 * - name (string): The name attribute for the input.
 * - value (string | boolean): The value of the input for non-checkbox types.
 * - divClassName (string): Custom CSS class for the container div (default is 'flex flex-col gap-2').
 * - className (string): Custom CSS class for the input field (default is a styled input field).
 *
 * @returns {JSX.Element}
 */


const GenericInput = forwardRef(
	(
		{
			id,
			label,
			labelClassName = 'flex text-sm text-left font-medium text-black',
			type,
			required = false,
			checked,
			onChange,
			placeholder = '',
			multiple = false,
			name,
			value,
			divClassName = 'flex flex-col gap-2',
			className = 'block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm',
		},
		ref
	) => {
		const inputProps = { id, type, required, onChange, placeholder, multiple, name, className };

		if (type === 'checkbox') {
			inputProps.checked = checked;
		}
		if (type === 'file') {
			inputProps.ref = ref;
		} else {
			inputProps.value = value;
		}

		return (
			<div className={divClassName}>
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
				<input {...inputProps} />
			</div>
		);
	}
);

export default GenericInput;
