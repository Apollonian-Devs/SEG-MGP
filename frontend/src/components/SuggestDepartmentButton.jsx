import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";

const SuggestDepartmentButton = ({ setSuggestedDepartments, tickets }) => {
  const fetchRandomDepartment = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/random-department/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      console.log("Fetched Random Department:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching random department:", error.response?.data || error.message);
      return null;
    }
  };

  const assignRandomDepartments = async () => {
    const updatedDepartments = {};
    for (const ticket of tickets) {
      const department = await fetchRandomDepartment();
      if (department) {
        console.log(`Assigning ${department.name} to Ticket ID: ${ticket.id}`);
        updatedDepartments[ticket.id] = department;
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
        assignRandomDepartments();
    }}
>
      Suggest Departments
    </GenericButton>
  );
};

export default SuggestDepartmentButton;
