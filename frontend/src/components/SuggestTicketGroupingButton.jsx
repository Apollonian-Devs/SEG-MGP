import React from "react";
import { toast } from "sonner";  // ✅ Import Sonner
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";
import { playSound } from "../utils/SoundUtils";
import handleApiError from "../utils/errorHandler";

import { getWithAuth } from "../utils/apiUtils";

const extractGroupedTickets = (tickets, clusterData) => {
    const grouped = {};
    for (const ticket of tickets) {
        if (clusterData[ticket.id] !== undefined) {
            grouped[ticket.id] = clusterData[ticket.id];
        }
    }
    return grouped;
};

const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
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

