import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import GenericButton from './GenericButton';

/**
 * @component
 * GenericDropdown - A customizable dropdown component that displays a menu when clicked, with dynamic positioning and an optional arrow indicator.
 *
 * @props
 * - buttonName (ReactNode): The content to be displayed on the dropdown button (e.g., text or icon).
 * - className (string): Custom CSS class for styling the dropdown button.
 * - children (ReactNode): The content of the dropdown menu, typically a list of options or actions.
 * - maxHeight (string): The maximum height of the dropdown menu (default is '128').
 * - showArrow (boolean): Determines whether an arrow indicator is displayed next to the button (default is true).
 * - dataTestId (string): A test ID for the dropdown button, used for automated testing.
 *
 * @state
 * - isOpen (boolean): Tracks whether the dropdown menu is open or closed.
 * - menuPositionAbove (boolean): Determines if the menu should be positioned above the button based on available space.
 * - menuPositionRight (boolean): Determines if the menu should be aligned to the right based on available space.
 * - dropdownWidth (number): Stores the width of the dropdown button to match the width of the menu.
 *
 * @methods
 * - toggleDropdown(): Toggles the dropdown menu open or closed.
 *
 * @effects
 * - useEffect for adjusting dropdown position: Calculates whether the menu should appear above or below the button and whether it should be aligned to the left or right.
 * - useEffect for closing dropdown when clicking outside: Listens for clicks outside the dropdown to close it.
 *
 * @returns {JSX.Element}
 */

const GenericDropdown = ({
	buttonName,
	className,
	children,
	maxHeight = '128',
	showArrow = true,
	dataTestId,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPositionAbove, setMenuPositionAbove] = useState(false);
	const [menuPositionRight, setMenuPositionRight] = useState(false);
	const [dropdownWidth, setDropdownWidth] = useState(0);
	const dropdownRef = useRef(null);
	const menuRef = useRef(null);

	const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

	useEffect(() => {
		if (isOpen && dropdownRef.current && menuRef.current) {
			const dropdown = dropdownRef.current.getBoundingClientRect();
			setDropdownWidth(dropdown.width);
			const menu = menuRef.current.getBoundingClientRect();
			const availableSpaceBelow = window.innerHeight - dropdown.bottom;
			const availableSpaceAbove = dropdown.top;

			if (
				menu.height > availableSpaceBelow &&
				availableSpaceAbove > availableSpaceBelow
			) {
				setMenuPositionAbove(true);
			} else {
				setMenuPositionAbove(false);
			}
			const availableSpaceRight = window.innerWidth - dropdown.right;
			if (menu.width > availableSpaceRight) {
				setMenuPositionRight(true);
			} else {
				setMenuPositionRight(false);
			}
		}
	}, [isOpen]); 

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
			<GenericButton
				onClick={(e) => {
					e.stopPropagation();
					toggleDropdown();
				}}
				className={`flex justify-between items-center ${className}`}
				dataTestId={dataTestId}
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

			{isOpen && (
				<div
					ref={menuRef}
					className={`absolute flex flex-col z-10 rounded-md bg-slate-100 ring-1 shadow-lg ring-black/5 max-h-${maxHeight} overflow-y-auto ${
						menuPositionAbove ? 'bottom-full mb-1' : 'top-full mt-1'
					} ${menuPositionRight ? 'right-0' : 'left-0'}`}
					style={{
						minWidth: dropdownWidth > 0 ? `${dropdownWidth}px` : 'auto',
						maxHeight: maxHeight === 'none' ? 'none' : `${maxHeight}px`,
					}}
					role="menu"
					data-position-above={menuPositionAbove}
  				data-position-right={menuPositionRight}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default GenericDropdown;
