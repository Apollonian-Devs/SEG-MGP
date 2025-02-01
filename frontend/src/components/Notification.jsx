import React from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const NotificationsTab = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
          } finally {
            setLoading(false);
          }
        };
    
        fetchNotifications();
      }, []);
    
      if (loading) {
        return <p>Loading notifications...</p>;
      }
    

      return (
        <div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-10 min-w-full inline-block align-middle">
              <h1 className="felx w-full text-center mb-5">notifications</h1>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                        Message
                      </th>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                        Created at
                      </th>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
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
                        <tr key={notification.id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {notification.ticket}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {notification.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {notification.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {notification.read_status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default NotificationsTab;
    