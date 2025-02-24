import React, { useState } from "react";
import GenericButton from "./GenericButton";
import Popup from "./Popup";
import ChangeDate from "./ChangeDate";

const ChangeDateButton = ({ ticket_id }) => {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const togglePopup = () => {
        setPopupOpen((prev) => !prev);
    };

    return (
        <>
            <GenericButton
                className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={(e) => {
                    e.stopPropagation();
                    togglePopup();
                }}
            >
                Select Date
            </GenericButton>
        
            <Popup isOpen={isPopupOpen} onClose={togglePopup} width="w-[50%]" height="h-[200%]">
                <ChangeDate ticket_id={ticket_id} />
            </Popup>
        </>
    )
}

export default ChangeDateButton;