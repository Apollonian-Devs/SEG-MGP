import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewTicketForm from './NewTicketForm';
import {GenericButton} from '.';
import Popup from './Popup';
import { playSound } from "../utils/SoundUtils";

/**
 * @component
 * NewTicketButton - A button component that opens a popup for creating a new ticket.
 * 
 * @state
 * - isPopupOpen (boolean): Tracks whether the new ticket popup is open.
 *
 * @methods
 * - togglePopup(): Toggles the visibility of the new ticket popup.
 *
 * @props
 * - fetchTickets (function): A function to refresh the ticket list after a new ticket is created.
 *
 * @returns {JSX.Element}
 */

const NewTicketButton = ({fetchTickets}) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

	const togglePopup = () => {
		setPopupOpen((prev) => !prev);
	};

	return (
		<>
			{/* Button to Open the New Ticket Form */}
			<GenericButton
				type="button"
				className="flex items-center justify-items-center px-3 h-12 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-full shadow-lg"
				onClick={() => {
					playSound();
					togglePopup();
				}}
			>
				<Plus /> New
			</GenericButton>

			{/* Popup for the New Ticket Form */}
			<Popup
				isOpen={isPopupOpen}
				onClose={togglePopup}
				width="w-[500px]"
				height="h-fit"
				data-testid="new-ticket-popup"
			>
				<NewTicketForm onClose={togglePopup} togglePopup={togglePopup} fetchTickets={fetchTickets}/>
			</Popup>
		</>
	);
};

export default NewTicketButton;
