import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GenericButton from './GenericButton';

const GenericDropdown = ({
  buttonName,
  className = '',
  children,
  maxHeight = 150,        // numeric: in pixels
  showArrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // For automatic positioning
  const [menuPositionAbove, setMenuPositionAbove] = useState(false);
  const [menuPositionRight, setMenuPositionRight] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const dropdownRef = useRef(null); // container for the button + menu
  const menuRef = useRef(null);     // container for the actual dropdown menu

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Positioning logic (above/below, left/right) once the dropdown is open
  useEffect(() => {
    if (isOpen && dropdownRef.current && menuRef.current) {
      // get bounding box of the button container
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      setDropdownWidth(dropdownRect.width);

      // get bounding box of the menu
      const menuRect = menuRef.current.getBoundingClientRect();

      // how much space is available below vs above the button
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      // if the menu is taller than spaceBelow, but there's more space above, place it above
      if (menuRect.height > spaceBelow && spaceAbove > spaceBelow) {
        setMenuPositionAbove(true);
      } else {
        setMenuPositionAbove(false);
      }

      // check horizontal space on the right
      const spaceRight = window.innerWidth - dropdownRect.right;
      // if not enough space on the right, push menu to the right side
      if (menuRect.width > spaceRight) {
        setMenuPositionRight(true);
      } else {
        setMenuPositionRight(false);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative flex flex-col" ref={dropdownRef}>
      {/* The toggle button */}
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
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <LucideChevronDown size={16} />
          </motion.span>
        )}
      </GenericButton>

      {/* The dropdown menu, animated via AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            key="dropdown-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`
              absolute z-10 rounded-md border border-gray-200 shadow-md bg-white
              ${menuPositionAbove ? 'bottom-full mb-1' : 'top-full mt-1'}
              ${menuPositionRight ? 'right-0' : 'left-0'}
              overflow-hidden
            `}
            style={{
              // match button width if you like
              minWidth: dropdownWidth > 0 ? `${dropdownWidth}px` : 'auto',
              maxHeight: `${maxHeight}px`, // limit the menu height
              overflowY: 'auto',           // enable scrolling
            }}
            role="menu"
          >
            {/* Actual dropdown content */}
            <div className="p-3 text-gray-700">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenericDropdown;

