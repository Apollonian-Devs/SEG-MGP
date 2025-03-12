import React from 'react';

const GenericInput = ({
	id,
	label,
	labelClassName = 'flex text-sm text-left font-medium text-black',
	type,
	required = false,
	checked = false,
	onChange,
	placeholder = '',
	multiple = false,
	name,
	value,
	divClassName = 'flex flex-col gap-2',
	className = 'block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm',
}) => {
	return (
		<div className={divClassName}>
			<label htmlFor={id} className={labelClassName}>
				{label}
			</label>
			<input
				id={id}
				type={type}
				required={required}
				checked={checked}
				onChange={onChange}
				placeholder={placeholder}
				multiple={multiple}
				name={name}
				value={value}
				className={className}
			/>
		</div>
	);
};

export default GenericInput;
