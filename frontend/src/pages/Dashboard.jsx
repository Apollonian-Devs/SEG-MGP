import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import TicketsCard from "../components/TicketsCard";
import UserDropdown from "../components/UserDropdown";
import AddTicketPopup from "../components/AddTicketPopup";
import NotificationsTab from "../components/Notification";

const Dashboard = () => {
  const [current_user, setCurrent_user] = useState(null);
  const [Notifications, setShowNotifications] = useState(false);
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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Ensure current_user is available before rendering
  if (!current_user) {
    return <p>Loading user details...</p>;
  }
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  return (
    <div style={{ position: 'relative' }}>
      <UserDropdown user={current_user} />
      {/* Pass current_user as a prop to TicketsCard */}
      <button
        
        style={{
          // position: "absolute",
          // top: "10px",
          // right: "10px",
          // borderRadius: "50%",
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
      see
      </button>
      <TicketsCard user={current_user} />
      {!current_user.is_staff && <AddTicketPopup />}
      
    </div>
  );
};

export default Dashboard;
