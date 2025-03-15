import React, { useState } from 'react';
import GenericDropdown from './GenericDropdown';
import GenericButton from './GenericButton';

const OfficersDropdown = ({
	ticketId,
	officers,
	admin,
	onSelectOfficer,
	defaultSelectedOfficer = null,
}) => {
	const [localOfficer, setLocalOfficer] = useState(defaultSelectedOfficer);

	const handleSelect = (officer) => {
		setLocalOfficer(officer);

		onSelectOfficer(ticketId, officer);
	};

	const getButtonLabel = () => {
		if (!localOfficer) return 'Select an officer';

		return localOfficer.is_superuser
			? localOfficer.username
			: localOfficer.user.username;
	};

	return (
		<GenericDropdown
			buttonName={<h5 className="text-sm">{getButtonLabel()}</h5>}
			className="flex justify-center items-center gap-x-1.5 
                 rounded-md bg-white px-2 py-1 text-sm font-semibold 
                 text-gray-900 ring-1 shadow-xs ring-gray-300 
                 ring-inset hover:bg-gray-50"
		>
			<div className="py-1" data-testid="officers-dropdown-menu">
				{officers.map((officer) => (
					<GenericButton
						key={officer.user.id}
						onClick={(e) => {
							e.stopPropagation();
							handleSelect(officer);
						}}
						className="block w-full text-left px-3 py-1 text-sm 
                       text-gray-700 hover:bg-gray-100"
					>
						{officer.user.username}
					</GenericButton>
				))}

				{/* Admin option, if provided */}
				{admin && (
					<GenericButton
						onClick={(e) => {
							e.stopPropagation();
							handleSelect(admin);
						}}
						className="block w-full text-left px-3 py-1 text-sm 
                       text-gray-700 hover:bg-gray-100 mt-2"
					>
						Admin: {admin.username}
					</GenericButton>
				)}
			</div>
		</GenericDropdown>
	);
};

export default OfficersDropdown;
