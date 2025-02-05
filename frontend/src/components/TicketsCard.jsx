import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Chat from "./Chat";
import OfficersDropdown from "../components/OfficersDropdown";
import RedirectButton from "./RedirectButton";
import GenericButton from "./GenericButton";

const TicketsCard = ({ user, officers }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [selectedOfficer, setSelectedOfficer] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/user-tickets/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setTickets(response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);



  if (loading) {
    return <p>Loading tickets...</p>;
  }

  return (
    <div className="relative">
    {/* Chat Component: Only Show When A Ticket is Selected */}
    {selectedTicket && (
  <div>
    <Chat ticket={selectedTicket} onClose={() => setSelectedTicket(null)} user={user} />
  </div>
)}




    <div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-10 min-w-full inline-block align-middle">
          <h1 className="felx w-full text-center mb-5">Tickets</h1>
          <div className="overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                  {user.is_staff && (
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                      Redirect
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {ticket.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {ticket.priority || "Not Set"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <GenericButton
                        text="Chat"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          console.log(`Chat for ticket ${ticket.id}`);
                          setSelectedTicket(ticket);
                        }}
                      />


              
                      </td>


                      {user.is_staff && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          <OfficersDropdown officers={officers} setSelectedOfficer={setSelectedOfficer} />
                          <RedirectButton ticketid={ticket.id} selectedOfficer={selectedOfficer} />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div> 
    </div>
  );
};

export default TicketsCard;
