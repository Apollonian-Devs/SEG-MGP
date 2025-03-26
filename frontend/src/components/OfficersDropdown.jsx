import React, { useState } from 'react';
import {GenericDropdown} from '.';
import {GenericButton} from '.';
import { User } from 'lucide-react';

/**
 * @component
 * OfficersDropdown - A dropdown menu for selecting an officer for a given ticket.
 *
 * @state
 * - localOfficer (object | null): Stores the currently selected officer.
 *
 * @methods
 * - handleSelect(officer): Updates the selected officer and triggers the parent callback.
 * - getButtonLabel(): Returns the display name for the currently selected officer.
 *
 * @props
 * - ticketId (string | number): The ID of the ticket associated with the selection.
 * - officers (array): A list of available officers to assign.
 * - admin (object | null): An optional admin user that can be selected.
 * - onSelectOfficer (function): Callback function to handle officer selection.
 * - defaultSelectedOfficer (object | null): The default pre-selected officer.
 *
 * @returns {JSX.Element}
 */


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
                       text-gray-700 hover:bg-gray-300"
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
                       text-gray-700 hover:bg-gray-300 mt-2"
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
