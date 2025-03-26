import React from 'react';
import {GenericButton} from '.';
import { playSound } from '../utils/SoundUtils';
import { formatApiErrorMessage } from '../utils/errorHandler';
import { postWithAuth } from '../utils/apiUtils';
import { handleToastPromise } from '../utils/toastUtils';

/**
 * @component
 * RedirectButton - A button component for redirecting a ticket to a selected officer or department.
 *
 * @props
 * - ticketid (number | string): The ID of the ticket being redirected.
 * - selectedOfficer (object | null): The officer to whom the ticket will be redirected.
 * - departmentId (number | string | null): The department to which the ticket will be redirected.
 * - fetchTickets (function): A function to refresh the ticket list after redirection.
 * - dataTestId (string): The test ID for the button, used for testing purposes.
 *
 * @methods
 * - handleRedirect(): Sends a request to redirect the ticket to the selected officer or department.
 *
 * @returns {JSX.Element}
 */


const RedirectButton = ({
	ticketid,
	selectedOfficer,
	departmentId,
	fetchTickets,
	dataTestId,
}) => {

	const isDisabled = !selectedOfficer && !departmentId;

	const handleRedirect = () => {
		if (isDisabled) {
			return;
		}


		const redirectTicketPromise = postWithAuth('/api/redirect-ticket/', {
			ticket: ticketid,
				to_profile: selectedOfficer
					? selectedOfficer.is_superuser
						? selectedOfficer.id
						: selectedOfficer.user?.id
					: null,
				department_id: departmentId,
		  });
		  

		  handleToastPromise(redirectTicketPromise, {
			loading: 'Loading...',
			successMessage: 'Ticket Redirected successfully',
			successCallback: async () => {
			  await fetchTickets();
			  console.log('Ticket was redirected to:', selectedOfficer || departmentId);
			},
			errorCallback: (error) =>
			  `Error redirecting ticket: ${formatApiErrorMessage(error, "An error occurred while redirecting the ticket", { includePrefix: false })}`,
		  });
		  
	};

	return (
		<GenericButton
			className={`flex items-center justify-center px-2 py-1 gap-1 rounded-md transition-colors duration-500
                ${isDisabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-customOrange-dark text-white hover:bg-customOrange-light'}
            `}
			onClick={(e) => {
				playSound();
				e.stopPropagation();
				handleRedirect();
			}}
			disabled={isDisabled}
			dataTestId={dataTestId}
		>
			Redirect
		</GenericButton>
	);
};

export default RedirectButton;
