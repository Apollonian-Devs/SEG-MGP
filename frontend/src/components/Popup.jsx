import React from 'react';
import {GenericButton} from '.';

const Popup = ({
	isOpen,
	onClose,
	children,
	width = 'w-[500px]',
	height = 'h=[300px]',
}) => {
	if (!isOpen) return null;

	return (
		<div
			data-testid="popup-overlay"
			className="fixed inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50"
			onClick={onClose}
		>
			<div
				className={`relative bg-white p-8 rounded-md shadow-lg ${width} ${height}`}
				onClick={(e) => e.stopPropagation()}
			>
				<GenericButton
					onClick={onClose}
					className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
				>
					&#10005;
				</GenericButton>

				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
};

export default Popup;
