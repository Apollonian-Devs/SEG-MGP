import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Chat from "./Chat";
import GenericButton from "./GenericButton";
import PopUp from "./Popup";
import GenericTable from "./GenericTable";
import OfficersDropdown from "./OfficersDropdown";
import DepartmentsDropdown from "./DepartmentsDropdown";
import RedirectButton from "./RedirectButton";
import StatusHistoryButton from "./StatusHistoryButton";

import ShowOverdueButton from "./ShowOverdueButton";
import ChangeDate from "./ChangeDate";


const TicketsCard = ({ user, officers, openPopup, selectedTicket, setSelectedTicket, tickets, setTickets }) => {
  // const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isChangeDateOpen, setChangeDateOpen] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

      return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * (direction === "asc" ? 1 : -1);
    });

    setTickets(sortedTickets);
  };

  // not necessary ? loading is never set in this component ... ?
  // if (loading) {
  //   return <p>Loading tickets...</p>;
  // }

  const toggleChangeDate = () => {
    setChangeDateOpen((prev) => !prev);
  }

  return (
    <>
      {/* Pop up for chat */}
      <div className="relative">
        {selectedTicket && (
          <>
            <PopUp
              isOpen={isChatOpen}
              onClose={() => setSelectedTicket(null)}
              width="w-[100%]"
              height="h-[100%]"
            >
              <Chat ticket={selectedTicket} onClose={() => setIsChatOpen(false)} user={user} />
            </PopUp>
          </>
        )}
      </div>

      {/* Pop up for change date form */}
      <div className="relative">
        {selectedTicket && (
          <PopUp
            isOpen={isChangeDateOpen}
            onClose={toggleChangeDate}
            width="w-[25%]"
            height="h-[25%]"
          >
            <ChangeDate 
            ticket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            setTickets={setTickets} 
            />

          </PopUp>

        )}
      </div>

      {/* Pop up for status history */}
      <div className="relative">
        {selectedTicket && (
          <PopUp
          isOpen={isHistoryOpen}
          onClose={() => {
            setSelectedTicket(null)
            setIsHistoryOpen(false)
          }}
          width="w-[80%]"
          height="h-[80%]"
          >
          <StatusHistoryButton ticketId={selectedTicket.id}  />

          </PopUp>
        )}

      </div>

      <div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-10 min-w-full inline-block align-middle">
            <h1 className="flex w-full text-center mb-5">Tickets</h1>
            <div>

            <div className="flex justify-end p-4">
              {/* Insert the ShowOverdueButton here */}
              <ShowOverdueButton setTickets={setTickets} allTickets={tickets} />
            </div>

              <GenericTable
                columnDefinition={
                  <>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer">
                      <GenericButton
                        className="flex items-center w-full gap-x-1"
                        onClick={() => sortTickets("subject")}
                      >
                        <p>Subject</p>
                        {sortConfig.key === "subject" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </GenericButton>
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer">
                      <GenericButton
                        className="flex items-center w-full gap-x-1"
                        onClick={() => sortTickets("status")}
                      >
                        <p>Status</p>
                        {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </GenericButton>
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer">
                      <GenericButton
                        className="flex items-center w-full gap-x-1"
                        onClick={() => sortTickets("priority")}
                      >
                        <p>Priority</p>
                        {sortConfig.key === "priority" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </GenericButton>
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 "><p>Actions</p></th>
                    {user.is_staff && (
                      <>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Redirect</th>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Change Due Date</th>
                      </>
                    )}

                    {user.is_superuser && 
                    (
                     <>
                     <th className="px-6 py-3 text-end text-xs font-medium text-gray-500"><p>Status History</p></th>
                     </>
                    )}
                  </>
                }
                data={tickets}
                dataName="tickets"
                  
                rowDefinition={(ticket) => (
                  <tr key={ticket.id}
                      className='hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        console.log(`Selected Ticket ID: ${ticket.id}, Due Date: ${ticket.due_date}`);
                        setSelectedTicket(ticket);
                        openPopup("viewTicket");
                      }}
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
                    {user.is_staff && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      {user.is_superuser ? (
                        <DepartmentsDropdown setSelectedDepartment={setSelectedDepartment} />
                      ) : (
                        <OfficersDropdown officers={officers} setSelectedOfficer={setSelectedOfficer} />
                      )}
                      <RedirectButton 
                        ticketid={ticket.id} 
                        selectedOfficer={selectedOfficer}
                        departmentId={user.is_superuser ? selectedDepartment?.id : null} 
                      />
                    </div>
                  </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <GenericButton
                          className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                            toggleChangeDate();
                          }}
                          >
                          Select Date
                        </GenericButton>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          
                          {user.is_superuser &&
                          <GenericButton
                            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setIsHistoryOpen(true);
                            }}
                          >
                            Status History
                          </GenericButton>
                          
                          }
                      </td>
                    </>

                )}
                  </tr>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketsCard;