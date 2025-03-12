import React from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import GenericButton from './GenericButton';

const SuggestDepartmentButton = ({ setSuggestedDepartments, tickets }) => {
	const fetchSuggestedDepartment = async (ticketId, ticketDescription) => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.post(
				'/api/suggested-department/',
				{
					ticket_id: ticketId,
					description: ticketDescription,
				},
				{
					headers: {
						Authorization: `Bearer ${access}`,
						'Content-Type': 'application/json',
					},
				}
			);
			console.log(
				'Fetched Suggested Department:',
				response.data.suggested_department
			);
			return response.data.suggested_department;
		} catch (error) {
			console.error(
				'Error fetching suggested department:',
				error.response?.data || error.message
			);
			return null;
		}
	};

	const assignSuggestedDepartments = async () => {
		const updatedDepartments = {};
		for (const ticket of tickets) {
			const response = await fetchSuggestedDepartment(
				ticket.id,
				ticket.description
			);
			if (response) {
				console.log(`Assigning ${response} to Ticket ID: ${ticket.id}`);
				updatedDepartments[ticket.id] = response;
			} else {
				console.warn(`No department assigned to Ticket ID: ${ticket.id}`);
			}
		}
		setSuggestedDepartments(updatedDepartments);
	};

	return (
		<GenericButton
			className="flex items-center justify-items-center px-3 h-10 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
			onClick={(e) => {
				e.stopPropagation();
				assignSuggestedDepartments();
			}}
		>
			Suggest Departments
		</GenericButton>
	);
};

export default SuggestDepartmentButton;
