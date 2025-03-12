import React from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import GenericButton from './GenericButton';

const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
	const assignRandomGrouping = async () => {
		const groupedTickets = {};

		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/user-tickets-grouping/', {
				headers: { Authorization: `Bearer ${access}` },
			});

			const clusterData = response.data.clusters;

			for (const ticket of tickets) {
				if (clusterData[ticket.id] !== undefined) {
					groupedTickets[ticket.id] = clusterData[ticket.id];
				}
			}

			setSuggestedGrouping(groupedTickets); // Update state
		} catch (error) {
			console.error(
				'Error fetching groupings:',
				error.response?.data || error.message
			);
		}
	};

	return (
		<GenericButton
			className="flex items-center justify-items-center px-3 h-10 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
			onClick={(e) => {
				e.stopPropagation();
				assignRandomGrouping();
			}}
		>
			Suggest Ticket Grouping
		</GenericButton>
	);
};

export default SuggestTicketGroupingButton;
