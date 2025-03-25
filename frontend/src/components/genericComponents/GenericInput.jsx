import React, { forwardRef } from 'react';

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
