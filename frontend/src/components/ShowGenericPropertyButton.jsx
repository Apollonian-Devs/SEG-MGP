import React, { useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";

const ShowGenericPropertyButton = ({ endpoint, buttonText, setTickets, allTickets }) => {
  const [isFiltered, setIsFiltered] = useState(false);
  const [allTicketsBackup, setAllTicketsBackup] = useState([]);

  const handleToggle = async () => {
    if (!isFiltered) {
      setAllTicketsBackup(allTickets);

      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${access}` },
        });

        setTickets(response.data.tickets);
        setIsFiltered(true);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    } else {
      setTickets(allTicketsBackup);
      setIsFiltered(false);
    }
  };

  return (
    <GenericButton
      onClick={handleToggle}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      {isFiltered ? "Show All Tickets" : buttonText}
    </GenericButton>
  );
};

export default ShowGenericPropertyButton


