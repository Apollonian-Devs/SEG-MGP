import React from 'react';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import GenericButton from './GenericButton';
import { toast } from 'sonner';
import { playSound } from '../utils/SoundUtils';
import { formatApiErrorMessage } from '../utils/errorHandler';
import { postWithAuth } from '../utils/apiUtils';

const RedirectButton = ({
	ticketid,
	selectedOfficer,
	departmentId,
	fetchTickets,
	dataTestId,
}) => {
	const handleRedirect = () => {
		if (!selectedOfficer && !departmentId) {
			return;
		}

		const redirectTicketPromise = postWithAuth('/api/redirect-ticket/', {
			ticket: ticketid,
			to_profile: selectedOfficer
			  ? selectedOfficer.is_superuser
				? selectedOfficer.id
				: selectedOfficer.user.id
			  : null,
			department_id: departmentId,
		  });
		  

		toast.promise(redirectTicketPromise, {
			loading: 'Loading...',
			success: async () => {
				await fetchTickets();
				console.log(
					'Ticket was redirected to:',
					selectedOfficer || departmentId
				);
				return 'Ticket Redirected successfully';
			},
			error: (error) =>
				`Error redirecting ticket: ${formatApiErrorMessage(
					error,
					"An error occurred while redirecting the ticket",
					{ includePrefix: false }
				)}`,
		});
	};

	const isDisabled = !selectedOfficer && !departmentId;

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
