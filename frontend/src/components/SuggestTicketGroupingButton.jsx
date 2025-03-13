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
			className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 inline-flex items-center"
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
