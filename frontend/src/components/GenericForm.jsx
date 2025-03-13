import React from 'react';
import GenericButton from './GenericButton';

const GenericForm = ({
	onSubmit,
	buttonLabel = 'Submit',
	className,
	method = 'post',
	children,
	buttonClass = 'flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark',
	'data-testid': testId = 'generic-form',
	...props
}) => {
	return (
		<form
			className={className}
			onSubmit={onSubmit}
			method={method}
			{...props}
			data-testid={testId}
		>
			{children}
			<GenericButton type="submit" className={buttonClass}>
				{buttonLabel}
			</GenericButton>
		</form>
	);
};

export default GenericForm;
