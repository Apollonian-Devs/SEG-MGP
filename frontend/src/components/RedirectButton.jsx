import React from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

const RedirectButton = ({ ticketid, selectedOfficer }) => {
    const handleRedirect = async () => {
        try {
            const access = localStorage.getItem(ACCESS_TOKEN); 
            const response = await api.post(
            "/api/redirect-ticket/", 
            {
                ticket_id: ticketid, 
                to_user: selectedOfficer.user.id, 
                new_status: 'Pending', 
                reason: 'Redirected for further inspection', 
            },
            {
                headers: {
                Authorization: `Bearer ${access}`, 
                },
            }
            );
        
            alert(`Ticket successfully redirected to ${selectedOfficer.user.username}`);
            
        
        } catch (error) {
            alert('Failed to redirect ticket. Please try again.');
        } 
    };

    return (
        <button
            type="button"
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={handleRedirect}
        >
            Redirect
        </button>
  
    );
};


export default RedirectButton;