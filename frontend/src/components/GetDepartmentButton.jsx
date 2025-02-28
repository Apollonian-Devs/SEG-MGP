import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";

const GetDepartmentButton = ({ selectedDepartments, setSelectedDepartments, tickets }) => {
  const fetchRandomDepartment = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/random-department/", {
        headers: { Authorization: `Bearer ${access}` },
      });
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
        updatedDepartments[ticket.id] = department;
      }
    }
    setSelectedDepartments(updatedDepartments); // Update state in TicketsCard
    console.log(selectedDepartments)
  };

  return (
    <GenericButton onClick={assignRandomDepartments}>
      Assign Random Departments
    </GenericButton>
  );
};

export default GetDepartmentButton;
