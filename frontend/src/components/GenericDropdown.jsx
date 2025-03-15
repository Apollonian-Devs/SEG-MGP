import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import GenericButton from './GenericButton';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

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
      {/* Button with click handler */}
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

			{/* Dropdown Menu */}
			{isOpen && (
				<div
					className={`absolute flex flex-col top-full left-0 z-10 mt-1 w-fit min-w-40 rounded-md bg-slate-100 ring-1 shadow-lg ring-black/5 max-h-${maxHeight} overflow-y-auto`}
					role="menu"
				>
					{children}
				</div>
			)}
		</div>

	);
};

export default GenericDropdown;