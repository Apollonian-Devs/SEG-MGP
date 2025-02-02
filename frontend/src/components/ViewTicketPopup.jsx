import React from "react";

const ViewTicketPopup = ({ ticket, isOpen, onClose }) => {

  return (
    <>
        {isOpen && ticket && (
            <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50">
                <div className="relative bg-white p-8 rounded-md shadow-lg w-[450px] min-h-[400px]">
                    <button 
                        onClick={onClose} 
                        className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        &#10005;
                    </button>
                                
                    <div className="flex flex-col justify-center items-center text-center">
                        <h2 className="text-2xl font-bold mb-4">{ticket.subject}</h2>
                        
                        <p className="text-xl text-gray-600 mt-4 mb-6">"{ticket.description}"</p>
                        
                        <p className="text-sm text-gray-500 mt-2">Status: {ticket.status}</p>
                        <p className="text-sm text-gray-500">Priority: {ticket.priority || "Not Set"}</p>
                        <p className="text-sm text-gray-500">Assigned to: {ticket.assigned_to || "Unassigned"}</p>
                        <p className="text-sm text-gray-500">Created at: {ticket.created_at || "Not Set"}</p>
                        <p className="text-sm text-gray-500">Closed at: {ticket.closed_at || "Not Set"}</p>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default ViewTicketPopup;
