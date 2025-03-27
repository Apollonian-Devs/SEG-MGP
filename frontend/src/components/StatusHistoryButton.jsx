import React, { useState, useEffect } from "react";
import {GenericTable} from ".";
import handleApiError from "../utils/errorHandler.js"
import { getWithAuth } from "../utils/apiUtils";

/**
 * @component
 * StatusHistoryButton - A button component that displays the status change history of a ticket.
 *
 * @props
 * - ticketId (number | string): The ID of the ticket for which status history is being fetched.
 *
 * @state
 * - statusRecords (array): Stores the list of status history records for the given ticket.
 *
 * @methods
 * - fetchRecords(): Fetches the status history for the given ticket using an API call.
 *
 * @returns {JSX.Element}
 */

const StatusHistoryButton = ({ ticketId }) => {
    const [statusRecords, setStatusRecords] = useState([]);
    
    const fetchRecords = async () => {
      try {
        const response = await getWithAuth(`/api/ticket-status-history/${ticketId}/`);

        setStatusRecords(response.data.status_history);
      } catch (error) {
        handleApiError(error, "Error fetching status history");
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
    