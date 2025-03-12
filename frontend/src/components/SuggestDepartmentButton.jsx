import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";

const SuggestDepartmentButton = ({ setSuggestedDepartments, tickets }) => {
  const fetchSuggestedDepartment = async (ticketId, ticketDescription) => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.post("/api/suggested-department/", 
        { 
          ticket_id: ticketId,
          description: ticketDescription 
        },
        {
          headers: { 
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json", 
          },
        }
      );
      console.log("Fetched Department:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching department:", error.response?.data || error.message);
      return null;
    }
  };

  const assignSuggestedDepartments = async () => {
    const updatedDepartments = {};
    for (const ticket of tickets) {
      const response = await fetchSuggestedDepartment(ticket.id, ticket.description);
      if (response && response.suggested_department) {
        console.log(`Assigning ${response.suggested_department.name} to Ticket ID: ${ticket.id}`);
        updatedDepartments[ticket.id] = response.suggested_department;
      } else {
        console.warn(`No department assigned to Ticket ID: ${ticket.id}`);
      }
    }
    setSuggestedDepartments(updatedDepartments);
  };

  return (
    <GenericButton
      className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
      onClick={(e) => {
        e.stopPropagation();
        assignSuggestedDepartments();
      }}
    >
      Suggest Departments
    </GenericButton>
  );
};

export default SuggestDepartmentButton;