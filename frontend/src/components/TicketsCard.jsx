import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Chat from "./Chat";
import GenericButton from "./GenericButton";
import PopUp from "./Popup";

const TicketsCard = ({ user, officers, openPopup }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/user-tickets/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setTickets(response.data.tickets);
        console.log("Tickets:", response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Sorting Function
  const sortTickets = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTickets = [...tickets].sort((a, b) => {
      const valueA = a[key] ?? ""; // Treat null/undefined as an empty string
      const valueB = b[key] ?? "";

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTickets(sortedTickets);
    console.log("Sorted Tickets:", sortedTickets);
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  return (
    <div className='relative'>
      {selectedTicket && (
        <PopUp
          isOpen={isChatOpen}
          onClose={() => setSelectedTicket(null)}
          width='w-[100%]'
          height='h-[100%]'
        >
          <Chat ticket={selectedTicket} onClose={() => setIsChatOpen(false)} user={user} />
        </PopUp>
      )}

      <div className='flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]'>
        <div className='-m-1.5 overflow-x-auto'>
          <div className='p-10 min-w-full inline-block align-middle'>
            <h1 className='flex w-full text-center mb-5'>Tickets</h1>
            <div className=''>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer'>
                    <GenericButton
                      className="flex items-center w-full gap-x-1"
                      onClick={() => sortTickets("subject")}
                    >
                      <p>Subject</p>
                      {sortConfig.key === "subject"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </GenericButton>

                    </th>
                    <th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer'>
                    <GenericButton
                      className="flex items-center w-full gap-x-1"
                      onClick={() => sortTickets("status")}
                    >
                      <p>Status</p>
                      {sortConfig.key === "status"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </GenericButton>

                    </th>
                    <th className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer'>
                    <GenericButton
                      className="flex items-center w-full gap-x-1"
                      onClick={() => sortTickets("priority")}
                    >
                      <p>Priority</p>
                      {sortConfig.key === "priority"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </GenericButton>

                    </th>

                    <th className='px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase'>
                      <p>Actions</p>
                    </th>

                    {user.is_staff && (
                      <th className='px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase'>
                        Redirect
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                        No tickets found.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className='hover:bg-gray-100 cursor-pointer'
                        onClick={() => openPopup("viewTicket", ticket)}
                      >
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                          {ticket.subject}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                          {ticket.status}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                          {ticket.priority || "Not Set"}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                          <GenericButton
                            className='text-blue-600 hover:text-blue-800'
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setIsChatOpen(true);
                            }}
                          >
                            Chat
                          </GenericButton>
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
    </div>
  );
};

export default TicketsCard;
