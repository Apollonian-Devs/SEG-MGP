import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';
import GenericButton from './GenericButton';

const GenericDropdown = ({
	buttonName,
	className,
	children,
	maxHeight = '60',
	showArrow = true,
	dataTestId,
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
		<div className="relative flex justify-center" ref={dropdownRef}>
			{/* Button with click handler */}
			<GenericButton
				onClick={(e) => {
					e.stopPropagation(); // Prevent event bubbling if nested inside a clickable parent
					toggleDropdown();
				}}
				className={className}
				dataTestId={dataTestId}
			>
				{buttonName}
				{showArrow && (
				<LucideChevronDown
					size={16}
					className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
				/>
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
