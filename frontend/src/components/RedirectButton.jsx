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
    tickets, // Add tickets state
    setTickets // Function to update tickets state
}) => {
	const handleRedirect = async () => {
		if (!selectedOfficer && !departmentId) {
			return;
		}

		const access = localStorage.getItem(ACCESS_TOKEN);
		try {
			await api.post(
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

			// ✅ Remove the ticket from UI immediately
			setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== ticketid));

			// ✅ Optionally, fetch updated tickets to ensure backend sync
			fetchTickets();

			toast.success("Ticket Redirected successfully");

		} catch (error) {
			toast.error(`Error redirecting ticket: ${error.message}`);
		}
	};

	const isDisabled = !selectedOfficer && !departmentId;

	return (
        <GenericButton
            className={`flex items-center justify-center px-2 py-1 gap-1 rounded-md transition-colors duration-500
                ${isDisabled ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-customOrange-dark text-white hover:bg-customOrange-light"}`}
            onClick={(e) => { 
                e.stopPropagation();
                handleRedirect();
            }}
            disabled={isDisabled}
        >
            Redirect
        </GenericButton>
    );
};

export default RedirectButton;
