import React from 'react';
import GenericButton from './GenericButton';

/**
 * @component
 * GenericForm - A reusable form component with a customizable submit button.
 *
 * @props
 * - onSubmit (function): The function to handle form submission.
 * - buttonLabel (string): The text displayed on the submit button (default is 'Submit').
 * - className (string): Custom CSS class for styling the form container.
 * - method (string): The HTTP method for form submission (default is 'post').
 * - children (ReactNode): The form fields and content inside the form.
 * - buttonClass (string): Custom CSS class for styling the submit button.
 * - data-testid (string): A test ID for automated testing (default is 'generic-form').
 * - props (object): Additional props passed to the form element.
 *
 * @returns JSX.Element
 */


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
