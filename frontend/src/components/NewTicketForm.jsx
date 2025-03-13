import React, { useState } from 'react';
import api from '../api';
import GenericForm from './GenericForm';
import GenericInput from './GenericInput';
import { handleFileChange } from '../utils/attachmentUtils';
import { toast } from 'sonner';

const NewTicketForm = ({ togglePopup }) => {
	const [subject, setSubject] = useState('');
	const [description, setDescription] = useState('');
	const [message, setMessage] = useState('');
	const [attachments, setAttachments] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = { subject, description, message, attachments };
		const newTicketPromise = api.post('api/tickets/', payload);

		toast.promise(newTicketPromise, {
			loading: 'Loading...',
			success: () => {
				togglePopup();
				setSubject('');
				setDescription('');
				setMessage('');
				setAttachments([]);
				return 'Ticket Submitted successfully';
			},
			error: (error) => {
				return `Error submitting ticket: ${error.message}`;
			},
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
				></GenericInput>

				<GenericInput
					id="description"
					label="Description"
					type="text"
					required={true}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Enter the description of your query"
				></GenericInput>

				<GenericInput
					id="message"
					label="Message"
					type="text"
					required={true}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Enter your message to the team"
				></GenericInput>

				<GenericInput
					id="attachments"
					label="Attachments"
					type="file"
					multiple={true}
					value={attachments}
					onChange={(e) => handleFileChange(e, setAttachments)}
					placeholder="Optionally attach relevant files"
				/>
			</GenericForm>
		</>
	);
};

export default NewTicketForm;
