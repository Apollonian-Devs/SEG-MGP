import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";

const SuggestDepartmentButton = ({ setSuggestedDepartments, tickets }) => {
  const fetchRandomDepartment = async () => {
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
      console.log("Fetched Suggested Department:", response.data.suggested_department);
      return response.data.suggested_department;
    } catch (error) {
      console.error("Error fetching suggested department:", error.response?.data || error.message);
      return null;
    }
  };

  const assignRandomDepartments = async () => {
    const updatedDepartments = {};
    for (const ticket of tickets) {
      const response = await fetchSuggestedDepartment(ticket.id, ticket.description);
      if (response) {
        console.log(`Assigning ${response} to Ticket ID: ${ticket.id}`);
        updatedDepartments[ticket.id] = response;
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