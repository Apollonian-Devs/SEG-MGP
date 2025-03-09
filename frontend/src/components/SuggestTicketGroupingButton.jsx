import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";


const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
    
    const assignRandomGrouping = async () => {
        const groupedTickets = {};
        for (const ticket of tickets) {
            const randomNumber = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
            groupedTickets[ticket.id] = randomNumber;
        }
        setSuggestedGrouping(groupedTickets);
    }
    
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
}

export default SuggestTicketGroupingButton;