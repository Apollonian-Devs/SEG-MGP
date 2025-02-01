import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import TicketsCard from "../components/TicketsCard";
import UserDropdown from "../components/UserDropdown";
import AddTicketPopup from "../components/AddTicketPopup";
import NotificationsTab from "../components/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

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
    <div >
      <div className="flex items-stretch justify-between  w-full mb-5">
        
    
      <UserDropdown user={current_user}/>

        <button className="w-20 rounded-l-full rounded-r-full text-white items-center justify-center bg-customOrange-dark hover:bg-customOrange-light" >
          
        <FontAwesomeIcon icon={faBell} />
        </button>
       
  
      </div>
      
      {/* Pass current_user as a prop to TicketsCard */}
      
      <TicketsCard user={current_user} />
      {!current_user.is_staff && <AddTicketPopup />}
      
    </div>
  );
};

export default Dashboard;
