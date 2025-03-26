import React from "react";

/**
 * @component
 * TicketDetails - A component that displays detailed information about a specific ticket.
 *
 * @props
 * - ticket (object): The ticket object containing detailed information such as subject, description, status, priority, assigned user, and dates.
 *
 * @returns {JSX.Element}
 */


const TicketDetails = ({ ticket }) => {

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-4">{ticket.subject}</h2>
      <p className="text-lg text-gray-600 mt-4 mb-6">"{ticket.description}"</p>
      <p className="text-sm text-gray-500 mt-2">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Priority: {ticket.priority || "Not Set"}</p>
      <p className="text-sm text-gray-500">Assigned to: {ticket.assigned_to || "Unassigned"}</p>
      <p className="text-sm text-gray-500">
        Created at: {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "Not Set"}
      </p>
      <p className="text-sm text-gray-500">
        Closed at: {ticket.closed_at ? new Date(ticket.closed_at).toLocaleString() : "Not Set"}
      </p>
      <p className="text-sm text-gray-500">
        Due Date: {ticket.due_date ? new Date(ticket.due_date).toLocaleString() : "Not Set"}
      </p>
      
    </div>
  );
};

export default TicketDetails;