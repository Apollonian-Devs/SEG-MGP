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
            className={`flex items-center justify-center px-2 py-1 gap-1 rounded-md transition-colors duration-500
                ${isDisabled ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-customOrange-dark text-white hover:bg-customOrange-light"}
            `}
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