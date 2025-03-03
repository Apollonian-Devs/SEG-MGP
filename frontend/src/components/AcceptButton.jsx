import React from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const AcceptButton = ({ ticketId, selectedOfficer, departmentId }) => {
    const handleRedirect = async () => {
        if (!selectedOfficer && !departmentId) {
            return;
        }

        try {
            const access = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.post(
                "/api/redirect-ticket/",
                {
                    ticket: ticketId,
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

    const isDisabled = !selectedOfficer && !departmentId;

    return (
        <GenericButton
            className={`px-3 py-1 text-sm font-semibold rounded-md 
            ${isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            onClick={(e) => { 
            e.stopPropagation();
            handleRedirect();
            }}
            disabled={isDisabled}
        >
            Accept
        </GenericButton>
    );
};

export default AcceptButton;