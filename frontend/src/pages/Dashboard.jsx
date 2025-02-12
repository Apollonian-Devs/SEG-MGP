import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import TicketsCard from "../components/TicketsCard";
import NewTicketButton from "../components/NewTicketButton";
import GenericDropdown from "../components/GenericDropdown";
import NotificationsTab from "../components/Notification";
import TicketDetails from "../components/TicketDetails";
import Popup from "../components/Popup";

const Dashboard = () => {
  const [current_user, setCurrent_user] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

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

  const openPopup = (type, ticket = null) => {
    setPopupType(type);
    setSelectedTicket(ticket);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupType(null);
    setSelectedTicket(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (current_user && current_user.is_staff) {
      fetchOfficers();
    }
  }, [current_user]);

  // Ensure current_user is available before rendering
  if (!current_user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <div className='flex justify-space-around items-center gap-x-5'>
        <div className='flex justify-center items-center'>
          {!current_user.is_staff && <NewTicketButton />}
        </div>
        <div className='flex items-stretch justify-between w-full mb-5'>
          <GenericDropdown
            buttonName={current_user.username}
            className='flex justify-center items-center gap-x-1.5 mb-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50'
          >
            <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Settings
            </a>
            <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Support
            </a>
            <a href='/logout' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Logout
            </a>
          </GenericDropdown>

          <NotificationsTab user={current_user} />
        </div>
      </div>
      <TicketsCard
        user={current_user}
        officers={current_user.is_staff && !current_user.is_superuser ? officers : undefined}
        openPopup={openPopup}
      />

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {popupType === "addTicket" && <AddTicketPopup />}
        {popupType === "viewTicket" && selectedTicket && <TicketDetails ticket={selectedTicket} />}
      </Popup>
    </div>
  );
};

export default Dashboard;
