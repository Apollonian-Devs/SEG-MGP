import React, { useState, useEffect, useRef } from "react";

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
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
    <div className='relative flex justify-center' ref={dropdownRef}>
      <button
        type='button'
        className='flex justify-center  items-center gap-x-1.5 mb-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50'
        onClick={toggleDropdown}
      >
        <h3>{user.username}</h3>
        <svg
          className={`size-5 text-gray-400 transition-transform ${
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
          className='absolute top-10 right-50 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5'
          role='menu'
        >
          <div className='py-1'>
            <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Settings
            </a>
            <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Support
            </a>
            <a href='/logout' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Log out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
