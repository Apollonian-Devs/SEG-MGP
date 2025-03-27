import React from "react";
import { toast } from "sonner";
import {GenericButton} from ".";
import { playSound } from "../utils/SoundUtils";
import handleApiError from "../utils/errorHandler";
import { getWithAuth } from "../utils/apiUtils";

/**
 * @component
 * SuggestTicketGroupingButton - A button component that suggests grouping for a set of tickets based on AI clustering.
 *
 * @props
 * - setSuggestedGrouping (function): A function to set the suggested ticket groupings.
 * - tickets (array): The list of tickets to be grouped.
 *
 * @methods
 * - assignRandomGrouping(): Fetches the suggested ticket grouping and updates the groupings using the setSuggestedGrouping function.
 *
 * @returns {JSX.Element}
 */

const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
    const extractGroupedTickets = (tickets, clusterData) => {
        const grouped = {};
        for (const ticket of tickets) {
            if (clusterData[ticket.id] !== undefined) {
                grouped[ticket.id] = clusterData[ticket.id];
            }
        }
        return grouped;
    };

    const assignRandomGrouping = async () => {
        try {
            const response = await getWithAuth('/api/user-tickets-grouping/');

            if (response.data.error) {
                toast.error("❌ Unable to group tickets. Please try again.");
                return;
            }

            const clusterData = response.data.clusters;
            const groupedTickets = extractGroupedTickets(tickets, clusterData);

            setSuggestedGrouping(groupedTickets);
            toast.success("✅ Ticket grouping suggestions updated!");
        } catch (error) {
            handleApiError(error, "Failed to fetch ticket groupings. Please try again.");
        }
    };

    return (
        <GenericButton
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={(e) => {
                playSound();
                e.stopPropagation();
                assignRandomGrouping();
            }}
        >
            Suggest Ticket Grouping
        </GenericButton>
    );
};

export default SuggestTicketGroupingButton;

