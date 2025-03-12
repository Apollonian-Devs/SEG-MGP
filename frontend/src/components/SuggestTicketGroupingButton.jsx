import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";


const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
    const assignRandomGrouping = async () => {
        const groupedTickets = {};

        try {
            const access = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.get('/api/user-tickets-grouping/', {
                headers: { Authorization: `Bearer ${access}` },
            });

            const clusterData = response.data.clusters; // Now correctly a dictionary

            for (const ticket of tickets) {
                if (clusterData[ticket.id] !== undefined) {
                    groupedTickets[ticket.id] = clusterData[ticket.id]; // Now correctly mapped
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
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
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

