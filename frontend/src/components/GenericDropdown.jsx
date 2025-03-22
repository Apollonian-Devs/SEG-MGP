import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GenericButton from './GenericButton';

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
	}, [isOpen]); // Run when isOpen changes

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