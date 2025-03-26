import React from 'react';
import {GenericButton} from '.';
import { playSound } from "../utils/SoundUtils";
import handleApiError from "../utils/errorHandler.js"
import { postWithAuth } from '../utils/apiUtils';

/**
 * @component
 * SuggestDepartmentButton - A button component for suggesting departments for a list of tickets.
 *
 * @props
 * - setSuggestedDepartments (function): A function to update the suggested departments for the tickets.
 * - tickets (array): List of tickets to which departments will be suggested.
 *
 * @methods
 * - fetchSuggestedDepartment(ticketId, ticketDescription): Fetches the suggested department for a specific ticket.
 * - assignSuggestedDepartments(): Loops through the tickets, fetches the suggested department for each, and updates the list of suggested departments.
 *
 * @returns {JSX.Element}
 */

const SuggestDepartmentButton = ({ setSuggestedDepartments, tickets }) => {
	const fetchSuggestedDepartment = async (ticketId, ticketDescription) => {
		try {
			const response = await postWithAuth(
				'/api/suggested-department/',
				{
				  ticket_id: ticketId,
				  description: ticketDescription,
				},
				{
				  headers: {
					'Content-Type': 'application/json',
				  },
				}
			  );
			  
			return response.data.suggested_department;
		} catch (error) {
			handleApiError(error, "Error fetching suggested department");
			return null;
		}
	};

	const assignSuggestedDepartments = async () => {
		if (tickets.length === 0) return;
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
			className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 inline-flex items-center"
			onClick={(e) => {
				playSound();
				e.stopPropagation();
				assignSuggestedDepartments();
			}}
		>
			Suggest Departments
		</GenericButton>
	);
};

export default SuggestDepartmentButton;
