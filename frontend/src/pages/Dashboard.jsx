import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import TicketsCard from "../components/TicketsCard";
import UserDropdown from "../components/UserDropdown";
import AddTicketPopup from "../components/AddTicketPopup";

const Dashboard = () => {
  const [current_user, setCurrent_user] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/current_user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log("Current User:", response.data);
      setCurrent_user({
        id: response.data.id,
        username: response.data.username,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        is_staff: response.data.is_staff,
        is_superuser: response.data.is_superuser,
      });
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Ensure current_user is available before rendering
  if (!current_user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <UserDropdown user={current_user} />
      <TicketsCard />
      {!current_user?.is_staff && <AddTicketPopup />}
    </div>
  );
};

export default Dashboard;
