import React, { useState } from 'react';
import api from '../api';
import {GenericForm} from '.';
import {GenericInput} from '.';
import { useFileInput } from '../utils/attachmentUtils';
import { toast } from 'sonner';
import { formatApiErrorMessage } from "../utils/errorHandler";
import { ACCESS_TOKEN } from '../constants';
import { postWithAuth } from '../utils/apiUtils';
import { handleToastPromise } from '../utils/toastUtils';

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