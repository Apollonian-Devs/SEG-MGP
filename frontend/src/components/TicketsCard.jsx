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
import SuggestDepartmentButton from "./SuggestDepartmentButton";
import AcceptButton from "./AcceptButton";
import StatusHistoryButton from "./StatusHistoryButton";

import ShowOverdueButton from "./ShowOverdueButton";
import ChangeDate from "./ChangeDate";


const TicketsCard = ({ user, officers, openPopup, tickets, setTickets, selectedTicket, setSelectedTicket }) => {
  //const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isChangeDateOpen, setChangeDateOpen] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [suggestedDepartments, setSuggestedDepartments] = useState({});

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

   //if (loading) {
   //  return <p>Loading tickets...</p>;
   //}

  const toggleChangeDate = () => {
    setChangeDateOpen((prev) => !prev);
  }

  return (
    <>
      {/* Pop-ups */}
      <div className="relative">
        {selectedTicket && (
          <>
            {/* Chat Pop-up */}
            <PopUp
              isOpen={isChatOpen}
              onClose={() => setSelectedTicket(null)}
              width="w-[100%]"
              height="h-[100%]"
            >
              <Chat ticket={selectedTicket} onClose={() => setIsChatOpen(false)} user={user} />
            </PopUp>
  
            {/* Change Due Date Pop-up */}
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
  
            {/* Status History Pop-up */}
            <PopUp
              isOpen={isHistoryOpen}
              onClose={() => {
                setSelectedTicket(null);
                setIsHistoryOpen(false);
              }}
              width="w-[80%]"
              height="h-[80%]"
            >
              <StatusHistoryButton ticketId={selectedTicket.id} />
            </PopUp>
          </>
        )}
      </div>
  
      {/* Ticket Table */}
      <div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-10 min-w-full inline-block align-middle">
            <h1 className="flex w-full text-center mb-5">Tickets</h1>
  
            {/* Suggest Department Button (Only for Superuser Staff) */}
            {user.is_staff && user.is_superuser && (
              <div className="mb-3 flex justify-end">
                <SuggestDepartmentButton setSuggestedDepartments={setSuggestedDepartments} tickets={tickets} />
              </div>
            )}
  
            {/* Show Overdue Button */}
            <div className="flex justify-end p-4">
              <ShowOverdueButton setTickets={setTickets} allTickets={tickets} />
            </div>
  
            {/* Table */}
            <GenericTable
              columnDefinition={
                <>
                  {["Subject", "Status", "Priority"].map((header) => (
                    <th key={header} className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer">
                      <GenericButton className="flex items-center w-full gap-x-1" onClick={() => sortTickets(header.toLowerCase())}>
                        <p>{header}</p>
                        {sortConfig.key === header.toLowerCase() ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </GenericButton>
                    </th>
                  ))}
  
                  <th className="px-6 py-3 text-end text-xs font-medium text-gray-500">Actions</th>
  
                  {user.is_staff && (
                    <>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500">Redirect</th>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500">Change Due Date</th>
                    </>
                  )}
  
                  {user.is_superuser && (
                    <>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500">Status History</th>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500">Suggested Departments</th>
                    </>
                  )}
                </>
              }
              data={tickets}
              dataName="tickets"
              rowDefinition={(ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    console.log(`Selected Ticket ID: ${ticket.id}, Due Date: ${ticket.due_date}`);
                    setSelectedTicket(ticket);
                    openPopup("viewTicket");
                  }}
                >
                  {/* Ticket Information */}
                  {["subject", "status", "priority"].map((key) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {ticket[key] || (key === "priority" ? "Not Set" : "")}
                    </td>
                  ))}
  
                  {/* Chat Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <GenericButton
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                        setIsChatOpen(true);
                      }}
                    >
                      Chat
                    </GenericButton>
                  </td>
  
                  {/* Staff-Specific Actions */}
                  {user.is_staff && (
                    <>
                      {/* Redirect */}
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
  
                      {/* Change Due Date */}
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
                    </>
                  )}
  
                  {/* Superuser-Specific Actions */}
                  {user.is_superuser && (
                    <>
                      {/* Status History Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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
                      </td>

                      {/* Suggested Departments & Accept Button Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex item-center gap-2">
                          {suggestedDepartments[ticket.id]?.name || "No suggestion"}
                          <AcceptButton 
                            ticketId={ticket.id} 
                            selectedOfficer={selectedOfficer} 
                            departmentId={suggestedDepartments[ticket.id]?.id}
                          />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketsCard;