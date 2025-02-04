import React, { useState, useEffect, useRef } from "react";


const OfficersDropdown = ({ officers, setSelectedOfficer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOfficer, setSelectedOfficerState] = useState(null)
    const dropdownRef = useRef(null);
    
  
    const toggleDropdown = () => {
      setIsOpen((prev) => !prev);
    };

    const handleSelect = (officer) => {
      setSelectedOfficer(officer)
      setSelectedOfficerState(officer)
      setIsOpen(false);
    };
  
    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

      return (
    <div className='flex items-center gap-2'> 
      <div className='relative flex justify-center' ref={dropdownRef}>
        <button
          type='button'
          className='flex justify-center items-center gap-x-1.5 rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50'
          onClick={toggleDropdown}
        >
          <h5>{selectedOfficer ? selectedOfficer.user.username : "Select an officer"}</h5>
          <svg
            className={`size-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className='absolute top-7 z-10 w-auto origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5'
            role='menu'
          >
            <div className='py-1'>
              {officers.map((officer) => (
                <button
                  key={officer.user.id}
                  onClick={() => handleSelect(officer)}
                  className='block w-full text-left px-4 py-1 text-sm text-gray-700 hover:bg-gray-100'
                >
                  {officer.user.username}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>      
    </div>
  );
    



}

export default OfficersDropdown;
