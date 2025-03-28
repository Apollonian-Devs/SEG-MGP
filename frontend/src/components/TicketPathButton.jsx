import React, { useState, useEffect } from "react";
import {GenericTable} from ".";
import handleApiError from "../utils/errorHandler.js";
import { getWithAuth } from "../utils/apiUtils";

/**
 * @component
 * TicketPathButton - A button component that displays the ticket's path, including information about where the ticket was redirected from and to.
 *
 * @props
 * - ticketId (number | string): The ID of the ticket whose path is being fetched.
 *
 * @state
 * - pathRecords (array): Stores the ticket's path records, including redirection details.
 *
 * @methods
 * - fetchRecords(): Fetches the ticket path data for the specified ticket ID from the API.
 *
 * @returns {JSX.Element}
 */


const TicketPathButton = ({ ticketId }) => {
    const [pathRecords, setPathRecords] = useState([]);
    
    const fetchRecords = async () => {
      try {
        const response = await getWithAuth(`/api/ticket-path/${ticketId}/`);

        setPathRecords(response.data.ticket_path);
      } catch (error) {
        handleApiError(error, "Error fetching ticket path");
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
                  Redirected from
                </th>,
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Redirected to
                </th>
              ]}
              data={pathRecords}
              dataName = 'ticket path'
              rowDefinition={(pathRecords) => (
                <tr key={pathRecords.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {pathRecords.from_username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {pathRecords.to_username}
                  </td>
            
                </tr>
              )} 
            />
      </>
    );
  };

export default TicketPathButton;
    