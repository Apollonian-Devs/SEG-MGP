import React, { useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const ShowUnansweredButton = ({ setTickets, allTickets }) => {
  const [showingUnanswered, setShowingUnanswered] = useState(false);
  const [allTicketsBackup, setAllTicketsBackup] = useState([]);

  const handleToggleUnanswered = async () => {
    if (!showingUnanswered) {
      setAllTicketsBackup(allTickets);

      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/unanswered-tickets/", {
          headers: { Authorization: `Bearer ${access}` },
        });

        setTickets(response.data.tickets);
        setShowingUnanswered(true);
      } catch (error) {
        console.error("Error fetching unanswered tickets:", error);
      }
    } else {

      setTickets(allTicketsBackup);
      setShowingUnanswered(false);
    }
  };

  return (
    <GenericButton
      onClick={handleToggleUnanswered}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      {showingUnanswered ? "Show All Tickets" : "Show Unanswered Tickets"}
    </GenericButton>
  );
};

export default ShowUnansweredButton;
