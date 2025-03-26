import React, { useState } from 'react';
import {GenericForm} from '.';
import {GenericInput} from '.';
import { useFileInput } from '../utils/attachmentUtils';
import { formatApiErrorMessage } from "../utils/errorHandler";
import { postWithAuth } from '../utils/apiUtils';
import { handleToastPromise } from '../utils/toastUtils';

/**
 * @component
 * NewTicketForm - A form component for submitting a new support ticket.
 *
 * @state
 * - subject (string): Stores the subject of the ticket.
 * - description (string): Stores the description of the ticket.
 * - message (string): Stores the detailed message for the support team.
 * - attachments (array): Stores the selected file attachments.
 *
 * @methods
 * - handleSubmit(): Handles form submission and sends the new ticket data to the API.
 *
 * @props
 * - togglePopup (function): Toggles the visibility of the new ticket popup.
 * - fetchTickets (function): Refreshes the ticket list after a new ticket is created.
 *
 * @returns {JSX.Element}
 */


const NewTicketForm = ({ togglePopup, fetchTickets }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState([]);

    const { fileInputRef, handleFileChange, resetFileInput } = useFileInput(setAttachments);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { subject, description, message, attachments };
        const newTicketPromise = postWithAuth('api/tickets/', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
        });
          

        handleToastPromise(newTicketPromise, {
            loading: 'Loading...',
            successMessage: 'Ticket Submitted successfully',
            successCallback: async () => {
              togglePopup();
              setSubject('');
              setDescription('');
              setMessage('');
              setAttachments([]);
              resetFileInput();
              await fetchTickets();
            },
            errorCallback: (error) => formatApiErrorMessage(error, "Error submitting ticket"),
          });
    };

    return (
        <>
            <h1 className="text-left font-poppins mb-10"> Send Query </h1>
            <GenericForm
                className="space-y-3"
                onSubmit={handleSubmit}
                buttonLabel="Send Ticket"
            >
                <GenericInput
                    id="subject"
                    label="Subject"
                    type="text"
                    required={true}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter the subject of your query"
                />

                <GenericInput
                    id="description"
                    label="Description"
                    type="text"
                    required={true}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the description of your query"
                />

                <GenericInput
                    id="message"
                    label="Message"
                    type="text"
                    required={true}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message to the team"
                />

                <GenericInput
                    id="attachments"
                    label="Attachments"
                    type="file"
                    multiple={true}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    placeholder="Optionally attach relevant files"
                />
            </GenericForm>
        </>
    );
};

export default NewTicketForm;