import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell,faTimes } from "@fortawesome/free-solid-svg-icons";
import Popup from "./Popup";
import GenericTable from "./GenericTable";
import GenericButton from "./GenericButton";

const NotificationsTab = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [isPopupOpen, setShowNotifications] = useState(false);
    const [clickedNotifications, setClickedNotifications] = useState(new Set()); 
    
    const fetchNotifications = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/user-notifications/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
      } 
    };
    
    const markSetAsRead = async () => {
      if (clickedNotifications.size>0){
        try {
          const access = localStorage.getItem(ACCESS_TOKEN);
          for (let entry of clickedNotifications) {
            await api.post(`/api/user-notifications/`,
              { id: entry },
               {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            })  
          };
          
        } catch (error) {
          console.error("Error marking notifications as read:", error.response?.data || error.message);
        }
      };
      }
      
    const handleNotificationClick = (id) => {
      setClickedNotifications((prev) => {
        const newClicked = new Set(prev);
        if (newClicked.has(id)) {
          newClicked.delete(id); 
        } else {
          newClicked.add(id);
        }
        return newClicked;
      });
    };
  
    const markAllRead = () => {
      setClickedNotifications(new Set(notifications.map(item=>item.id)))
    }
    
    const toggleNotifications = () => {
      if(!isPopupOpen){
        fetchNotifications();
      }else {
        markSetAsRead();
      }
      setShowNotifications(!isPopupOpen);
    };
    return (
      <>
      
      <GenericButton 
        className="w-20 rounded-l-full rounded-r-full text-white items-center justify-center bg-customOrange-dark hover:bg-customOrange-light"
        onClick={toggleNotifications}
      >
        <FontAwesomeIcon icon={faBell} />
      </GenericButton>
      
      <Popup
      isOpen={isPopupOpen}
      onClose={toggleNotifications}
      width="w-[80%]"
      height="h-[80%]"
      >
          <GenericButton 
            className="absolute top-4 left-4 w-20 h-10 bg-customOrange-dark text-white rounded-md"
            onClick={markAllRead}
          >
            Read All
          </GenericButton>
          <div className="px-10 py-16 overflow-hidden">
          
          <GenericTable
              columnDefinition={[
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Created at
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Read status
                </th>
              ]}
              data={notifications}
              dataName = 'notifications'
              rowDefinition={(notification) => (
                <tr key={notification.id} className={`${clickedNotifications.has(notification.id) ? "bg-green-200" : "bg-red-200"}  cursor-pointer`}
                onClick={() => handleNotificationClick(notification.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {notification.ticket_subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {notification.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {notification.created_at || "Not Set"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {notification.read_Status || "Not Set"}
                  </td>
                </tr>
              )} 
            />
            
          </div>
          </Popup>
      </>
    );
  };
    


export default NotificationsTab;
    