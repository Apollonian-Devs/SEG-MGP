import React from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const RedirectButton = ({ ticketid, selectedOfficer }) => {
    const handleRedirect = async () => {
        if (!selectedOfficer || !selectedOfficer.user || !selectedOfficer.user.id) {
            alert("No officer selected. Please select an officer to redirect the ticket.");
            return;  
        }
        try {
            const access = localStorage.getItem(ACCESS_TOKEN); 
            const response = await api.post(
            "/api/redirect-ticket/", 
            {
                ticket: ticketid, 
                to_profile: selectedOfficer.user.id, 
            },
            {
                headers: {
                Authorization: `Bearer ${access}`, 
                },
            }
            );
        
            alert(`Ticket successfully redirected to ${selectedOfficer.user.username}`);
            console.log(`updated ticket: ${ticketid}`);
            console.log(`updated ticket: ${selectedOfficer.user.id}`);
            console.log(`updated ticket: ${response.data.ticket}`);
            
        
        } catch (error) {
            console.error("Error redirecting ticket:", error);
            alert('Failed to redirect ticket. Please try again.');
        } 
    };

    //px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700
    return (
        <GenericButton
        className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={(e) => { 
            e.stopPropagation();
            handleRedirect();
        }}
        >
        Redirect
        </GenericButton>
    );
};


export default RedirectButton;
