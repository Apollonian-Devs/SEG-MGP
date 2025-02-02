import React from "react";
import "../addTicketPopupCSS.css";
import { useState, useEffect, useRef } from "react";
import { Plus } from 'lucide-react';
import NewTicketForm from "./NewTicketForm";

const AddTicketPopup = () => {
  
  const [open, setOpen] = useState(false);
  
  const togglePopup = () => {
    setOpen((prev) => !prev);
  }

  return ( 
  <div>
    <button 
      type="button"
      className='button'
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

export default AddTicketPopup;
