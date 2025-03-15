import React, { useState } from 'react';
import GenericDropdown from './GenericDropdown';
import GenericButton from './GenericButton';
import { User } from 'lucide-react';

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
			buttonName={<h5 className="text-sm truncate">{getButtonLabel()}</h5>}
			className="flex justify-center items-center w-40 gap-x-1.5 
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
						className="flex items-center gap-2 w-full text-left px-3 py-1 text-sm 
                       text-gray-700 hover:bg-gray-100"
					>
						<User className="h-5 w-5 text-customOrange-dark" />
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
						className="flex items-center w-full gap-2 text-left px-3 py-1 text-sm 
                       text-gray-700 hover:bg-gray-100 mt-2"
					>
						<User className="h-5 w-5 text-green-500" />
						Admin: {admin.username}
					</GenericButton>
				)}
			</div>
		</GenericDropdown>
	);
};

export default OfficersDropdown;
