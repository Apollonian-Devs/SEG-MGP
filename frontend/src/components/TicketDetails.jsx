import React from "react";

const TicketDetails = ({ ticket }) => {

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-4">{ticket.subject}</h2>
      <p className="text-lg text-gray-600 mt-4 mb-6">"{ticket.description}"</p>
      <p className="text-sm text-gray-500 mt-2">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Priority: {ticket.priority || "Not Set"}</p>
      <p className="text-sm text-gray-500">Assigned to: {ticket.assigned_to || "Unassigned"}</p>
      <p className="text-sm text-gray-500">Created at: {ticket.created_at || "Not Set"}</p>
      <p className="text-sm text-gray-500">Closed at: {ticket.closed_at || "Not Set"}</p>
      <p className="text-sm text-gray-500">Due Date: {ticket.due_date || "Not Set"}</p>
    </div>
  );
};

export default TicketDetails;