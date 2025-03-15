import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import GenericButton from './GenericButton';
import { motion, AnimatePresence } from 'framer-motion';

const GenericDropdown = ({
  buttonName,
  className,
  children,
  maxHeight = '60',
  showArrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <GenericButton
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        className={`flex justify-between items-center ${className}`}
      >
        {buttonName}
        {showArrow && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }} // Animate arrow rotation
            transition={{ duration: 0.2 }}
          >
            <LucideChevronDown size={16} />
          </motion.span>
        )}
      </GenericButton>

      {/* Animated Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`absolute left-0 top-full z-10 mt-1 w-full rounded-md bg-white border border-gray-200 shadow-md overflow-hidden`}
            role="menu"
          >
            <div className="p-3 text-gray-700 max-h-[${maxHeight}px] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenericDropdown;
