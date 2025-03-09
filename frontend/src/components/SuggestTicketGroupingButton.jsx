import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";


const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
    return (
        <GenericButton
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={(e) => { 
                e.stopPropagation();

            }}
        >
            Suggest Ticket Grouping
        </GenericButton>
    );
}

export default SuggestTicketGroupingButton;