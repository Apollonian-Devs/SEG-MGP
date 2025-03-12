import React from 'react';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import GenericButton from './GenericButton';

const RedirectButton = ({
	ticketid,
	selectedOfficer,
	departmentId,
	fetchTickets,
}) => {
	const handleRedirect = async () => {
		// Check if either an officer or department is selected
		if (!selectedOfficer && !departmentId) {
			alert(
				'Please select either an officer or a department to redirect the ticket.'
			);
			return;
		}

		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.post(
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

			alert(`Ticket successfully redirected`);

			console.log('Redirect response:', response.data);
			fetchTickets();
		} catch (error) {
			console.error('Error redirecting ticket:', error);
			alert('Failed to redirect ticket. Please try again.');
		}
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
