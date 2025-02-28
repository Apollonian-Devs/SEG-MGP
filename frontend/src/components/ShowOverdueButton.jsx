import React, { useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const ShowOverdueButton = ({ setTickets, allTickets }) => {
  const [showingOverdue, setShowingOverdue] = useState(false);
  const [allTicketsBackup, setAllTicketsBackup] = useState([]);

  const handleToggleOverdue = async () => {
    if (!showingOverdue) {
      setAllTicketsBackup(allTickets);

      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/overdue-tickets/", {
          headers: { Authorization: `Bearer ${access}` },
        });

        setTickets(response.data.tickets);
        setShowingOverdue(true);
      } catch (error) {
        console.error("Error fetching overdue tickets:", error);
      }
    } else {

      setTickets(allTicketsBackup);
      setShowingOverdue(false);
    }
  };

  return (
    <GenericButton
      onClick={handleToggleOverdue}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      {showingOverdue ? "Show All Tickets" : "Show Overdue Tickets"}
    </GenericButton>
  );
};

export default ShowOverdueButton;
