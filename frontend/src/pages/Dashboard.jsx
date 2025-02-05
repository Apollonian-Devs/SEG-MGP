import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import TicketsCard from "../components/TicketsCard";
import UserDropdown from "../components/UserDropdown";
import AddTicketPopup from "../components/AddTicketPopup";
import OfficersDropdown from "../components/OfficersDropdown";

const Dashboard = () => {
  const [current_user, setCurrent_user] = useState(null);
  const [officers, setOfficers] = useState([]);

  const fetchCurrentUser = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/current_user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log("Current User:", response.data);
      setCurrent_user(response.data); // No need to manually restructure the object
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data || error.message);
    }
  };

  const fetchOfficers = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/all-officers/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log("All Officers", response.data);
      setOfficers(response.data); // No need to manually restructure the object
    } catch (error) {
      console.error("Error fetching officers", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (current_user && current_user.is_staff){
      fetchOfficers();
    }
  }, [current_user]);


  // Ensure current_user is available before rendering
  if (!current_user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <UserDropdown user={current_user} />
      {/* Pass current_user as a prop to TicketsCard */}
      <TicketsCard user={current_user} officers={current_user.is_staff && !current_user.is_superuser ? officers : undefined} />
      {!current_user.is_staff && <AddTicketPopup />}
    </div>
  );
};

export default Dashboard;
