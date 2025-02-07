import React, { useState, useRef, useEffect } from "react";
import { LucideChevronDown } from "lucide-react";
import GenericButton from "./GenericButton";


const GenericDropdown = ({ buttonName, className, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    console.log(isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-center" ref={dropdownRef}>
      {/* Button with click handler */}
      <GenericButton onClick={toggleDropdown} className={className}>
        <h3>{buttonName}</h3>
        <LucideChevronDown size={16} className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}/>
      </GenericButton>
      

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute flex flex-col top-10 right-50 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 max-h-60 overflow-y-auto"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default GenericDropdown;
