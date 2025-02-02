import React from "react";
import { useState, useEffect, useRef } from "react";
import { Plus } from 'lucide-react';
import NewTicketForm from "./NewTicketForm";

const NewTicketButton = () => {
  
  const [open, setOpen] = useState(false);
  
  const togglePopup = () => {
    setOpen((prev) => !prev);
  }

  return ( 
  <div>
    <button 
      type="button"
      className="bg-[#f09b1c] text-white p-5 text-center text-base m-1 transition-all duration-250 rounded-[25px] flex items-center hover:bg-[#E48700] hover:text-black hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
      onClick={togglePopup}
    >
        <Plus /> new
    </button>

    
    {open && (
      // link to generic popup ?
      
        <NewTicketForm />
      
      )}

    
  </div>);
};

export default NewTicketButton;
