import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewTicketForm from './NewTicketForm';
import GenericButton from './GenericButton';
import Popup from './Popup';

const NewTicketButton = () => {
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
				onClick={togglePopup}
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
				<NewTicketForm onClose={togglePopup} togglePopup={togglePopup} />
			</Popup>
		</>
	);
};

export default NewTicketButton;
