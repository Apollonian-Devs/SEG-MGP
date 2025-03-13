import React from 'react';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import GenericButton from './GenericButton';
import { toast } from 'sonner';

const RedirectButton = ({
	ticketid,
	selectedOfficer,
	departmentId,
	fetchTickets,
}) => {
	const handleRedirect = () => {
		// Check if either an officer or department is selected
		if (!selectedOfficer && !departmentId) {
			alert(
				'Please select either an officer or a department to redirect the ticket.'
			);
			return;
		}

		const access = localStorage.getItem(ACCESS_TOKEN);
		const redirectTicketPromise = api.post(
			'/api/redirect-ticket/',
			{
				ticket: ticketid,
				to_profile: selectedOfficer
					? selectedOfficer.is_superuser
						? selectedOfficer.id
						: selectedOfficer.user.id
					: null,
				department_id: departmentId,
			},
			{
				headers: {
					Authorization: `Bearer ${access}`,
				},
			}
		);

		toast.promise(redirectTicketPromise, {
			loading: 'Loading...',
			success: () => {
				fetchTickets(); // ✅ Now this runs only after success
				return 'Ticket Redirected successfully';
			},
			error: (error) => {
				return `Error redirecting ticket: ${error.message}`;
			},
		});
	};

	return (
		<GenericButton
			className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
			onClick={(e) => {
				e.stopPropagation();
				handleRedirect();
			}}
		>
			Redirect
		</GenericButton>
	);
};

export default RedirectButton;
