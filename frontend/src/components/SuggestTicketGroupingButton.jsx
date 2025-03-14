import React from "react";
import { toast } from "sonner";  // ✅ Import Sonner
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
    
            if (response.data.error) {
    
                toast.error(`❌ ${response.data.error}`);
                return;
            }
    
            const clusterData = response.data.clusters;
            for (const ticket of tickets) {
                if (clusterData[ticket.id] !== undefined) {
                    groupedTickets[ticket.id] = clusterData[ticket.id];
                }
            }
    
            setSuggestedGrouping(groupedTickets);
            toast.success("✅ Ticket grouping suggestions updated!");
    
        } catch (error) {
            
            const errorMessage = error.response?.data?.error || "Failed to fetch ticket groupings. Please try again.";
            toast.error(`❌ ${errorMessage}`);
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
