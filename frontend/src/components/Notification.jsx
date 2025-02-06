import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell,faTimes } from "@fortawesome/free-solid-svg-icons";

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
          clickedNotifications.forEach(async (entry) => {
            await api.post(`/api/user-notifications/`,
              { id: entry },
               {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            })  
          });
          
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
      
      <button className="w-20 rounded-l-full rounded-r-full text-white items-center justify-center bg-customOrange-dark hover:bg-customOrange-light" onClick={toggleNotifications}>
        
      <FontAwesomeIcon icon={faBell} />
      </button>
      
      
      {isPopupOpen && (
        <div>
          <div  className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleNotifications}></div>
          <div className="bg-white w-[80%] h-[80%] rounded-3xl fixed top-0 left-0 right-0 bottom-0 m-auto z-50 border-4 border-customOrange-dark">
          <button className="absolute top-4 right-4 w-10 h-10 bg-customGray-dark text-white rounded-full"onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faTimes} />
          </button>
          <button className="absolute top-4 left-4 w-20 h-10 bg-customOrange-dark text-white rounded-md"onClick={markAllRead}>
          read all
          </button>
          <div className="px-10 py-16 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Created at
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Read status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  notifications.map((notification) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>

        </div>
      )}
      </>
    );
  };
    
    export default NotificationsTab;
    