import React, { useState } from "react";
import { Plus } from "lucide-react";
import NewTicketForm from "./NewTicketForm";
import GenericButton from "./GenericButton";
import Popup from "./Popup";

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
        className="flex justify-center items-center mb-5 bg-[#f09b1c] text-white font-poppins p-5 text-center text-base m-1 transition-all duration-250 rounded-[25px] hover:bg-[#E48700] hover:text-black hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={togglePopup}
      >
        <Plus /> New
      </GenericButton>

      {/* Popup for the New Ticket Form */}
      <Popup isOpen={isPopupOpen} onClose={togglePopup} width="w-[50%]" height="h-[60%]">
        <NewTicketForm onClose={togglePopup} />
      </Popup>
    </>
  );
};

export default NewTicketButton;
