import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell,faTimes } from "@fortawesome/free-solid-svg-icons";
import Popup from "./Popup";
import GenericTable from "./GenericTable";
import GenericButton from "./GenericButton";

const StatusHistoryButton = ({ ticketId }) => {
    const [statusRecords, setStatusRecords] = useState([]);
    
   
    
    const fetchRecords = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get(`/api/ticket-status-history/${ticketId}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        setStatusRecords(response.data.status_history);
      } catch (error) {
        console.error("Error fetching status history:", error.response?.data || error.message);
      } 
    };
  
    useEffect(() => {
      fetchRecords();
    }, [ticketId]);

    return (
      <>
      
      
        
 
          
          <GenericTable
              columnDefinition={[
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Old status
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  New status
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Changed by
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Changed at
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Notes
                </th>
              ]}
              data={statusRecords}
              dataName = 'status history'
              rowDefinition={(statusRecords) => (
                <tr key={statusRecords.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {statusRecords.old_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {statusRecords.new_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {statusRecords.profile_username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {statusRecords.changed_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {statusRecords.notes}
                  </td>
                </tr>
              )} 
            />
            

       

      </>
    );
  };
    


export default StatusHistoryButton;
    