import React from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const AcceptButton = ({ ticketid, selectedOfficer, departmentId }) => {
    const handleRedirect = async () => {
        if (!selectedOfficer && !departmentId) {
            alert("Please select either an officer or a department to redirect the ticket.");
            return;
        }

        try {
            const access = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.post(
                "/api/redirect-ticket/",
                {
                    ticket: ticketid,
                    to_profile: selectedOfficer ? selectedOfficer.user.id : null,
                    department_id: departmentId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
        
            const redirectTarget = selectedOfficer ? 
                `officer ${selectedOfficer.user.username}` : 
                `department's chief officer`;
            
            alert(`Ticket successfully redirected to ${redirectTarget}`);
            
            console.log("Redirect response:", response.data);
        
        } catch (error) {
            console.error("Error redirecting ticket:", error);
            alert('Failed to redirect ticket. Please try again.');
        } 
    };

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

export default AcceptButton;