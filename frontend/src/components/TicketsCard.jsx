import React, { useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Chat from './Chat';
import GenericButton from './GenericButton';
import PopUp from './Popup';
import GenericTable from './GenericTable';
import OfficersDropdown from './OfficersDropdown';
import DepartmentsDropdown from './DepartmentsDropdown';
import RedirectButton from './RedirectButton';
import SuggestDepartmentButton from './SuggestDepartmentButton';
import AcceptButton from './AcceptButton';
import StatusHistoryButton from './StatusHistoryButton';
import SuggestTicketGroupingButton from './SuggestTicketGroupingButton';
import TicketPathButton from './TicketPathButton';
import ChangeDate from './ChangeDate';
import { MessageSquareMore, RefreshCw } from 'lucide-react';
import FilterTicketsDropdown from './FilterTicketsDropdown';

const TicketsCard = ({
	user,
	officers,
	admin,
	openPopup,
	tickets,
	setTickets,
	selectedTicket,
	setSelectedTicket,
	fetchTickets,
}) => {
	const [showingTickets, setShowingTickets] = useState(tickets);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedOfficer, setSelectedOfficer] = useState(null);
	const [isChangeDateOpen, setChangeDateOpen] = useState(null);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [isPathOpen, setIsPathOpen] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [suggestedDepartments, setSuggestedDepartments] = useState({});
	const [suggestedGrouping, setSuggestedGrouping] = useState({});

	// Sorting State
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	useEffect(() => {
		setShowingTickets(tickets);
	}, [tickets]);

	const toggleChange = async (type, ticket_id) => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const path = type === 'priority' ? 'change-priority' : 'change-status';
			const response = await api.get(`/api/tickets/${path}/${ticket_id}/`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			console.log('Response: ', response.data);
		} catch (error) {
			console.error(
				'Error changing status:',
				error.response?.data || error.message
			);
		} finally {
			fetchTickets();
		}
	};

	// Sorting Function
	const sortTickets = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sortedTickets = [...showingTickets].sort((a, b) => {
			const valueA = a[key] ?? ''; // Treat null/undefined as an empty string
			const valueB = b[key] ?? '';

			return (
				(valueA < valueB ? -1 : valueA > valueB ? 1 : 0) *
				(direction === 'asc' ? 1 : -1)
			);
		});

		setShowingTickets(sortedTickets);
	};

	const toggleChangeDate = () => {
		setChangeDateOpen((prev) => !prev);
	};

	return (
		<>
			{/* Pop-ups */}
			<div className="relative">
				{selectedTicket && (
					<>
						{/* Chat Pop-up */}
						<PopUp
							isOpen={isChatOpen}
							onClose={() => setSelectedTicket(null)}
							width="w-[100%]"
							height="h-[100%]"
						>
							<Chat
								ticket={selectedTicket}
								onClose={() => setIsChatOpen(false)}
								user={user}
							/>
						</PopUp>

						{/* Change Due Date Pop-up */}
						<PopUp
							isOpen={isChangeDateOpen}
							onClose={toggleChangeDate}
							width="w-[25%]"
							height="h-[25%]"
						>
							<ChangeDate
								ticket={selectedTicket}
								setSelectedTicket={setSelectedTicket}
								setTickets={setTickets}
							/>
						</PopUp>

						{/* Status History Pop-up */}
						<PopUp
							isOpen={isHistoryOpen}
							onClose={() => {
								setSelectedTicket(null);
								setIsHistoryOpen(false);
							}}
							width="w-[80%]"
							height="h-[80%]"
						>
							<StatusHistoryButton ticketId={selectedTicket.id} />
						</PopUp>

						{/* Ticket Path Pop-up */}
						<PopUp
							isOpen={isPathOpen}
							onClose={() => {
								setSelectedTicket(null);
								setIsPathOpen(false);
							}}
							width="w-[80%]"
							height="h-[80%]"
						>
							<TicketPathButton ticketId={selectedTicket.id} />
						</PopUp>
					</>
				)}
			</div>

			{/* Ticket Table */}
			<div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-visible">
				<div className="p-10 min-w-full inline-block align-middle">
					<div className="flex justify-between items-center mb-5">
						<h1 className="flex text-center">Tickets</h1>
						<div className="flex justify-between items-center gap-2 h-10">
							<FilterTicketsDropdown
								tickets={tickets}
								setShowingTickets={setShowingTickets}
							/>
							{/* Suggest Department Button (Only for Superuser Staff) */}
							{user.is_staff && user.is_superuser && (
								<div className="flex justify-end">
									<SuggestDepartmentButton
										setSuggestedDepartments={setSuggestedDepartments}
										tickets={tickets}
									/>
								</div>
							)}

							{/* Group Tickets Button (For department heads and admins (superusers) ) */}
							{user.is_staff &&
								(user.is_department_head || user.is_superuser) && (
									<div className="flex justify-end">
										<SuggestTicketGroupingButton
											setSuggestedGrouping={setSuggestedGrouping}
											tickets={tickets}
										/>
									</div>
								)}
						</div>
					</div>

					<GenericTable
						columnDefinition={
							<>
								{['Subject', 'Status', 'Priority'].map((header) => (
									<th
										key={header}
										className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer"
									>
										<GenericButton
											className="flex items-center w-full gap-x-1"
											onClick={() => sortTickets(header.toLowerCase())}
										>
											<p>{header}</p>
											{sortConfig.key === header.toLowerCase()
												? sortConfig.direction === 'asc'
													? '▲'
													: '▼'
												: ''}
										</GenericButton>
									</th>
								))}

								<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
									<p>Actions</p>
								</th>

								{user.is_staff && (
									<>
										<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
											<p>Redirect</p>
										</th>
										<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
											<p>Change Due Date</p>
										</th>
									</>
								)}

								{user.is_superuser && (
									<>
										<th
											className="px-6 py-3 text-end text-xs font-medium text-gray-500"
											data-testid="status-history-header"
										>
											<p>Status History</p>
										</th>
										<th
											className="px-6 py-3 text-end text-xs font-medium text-gray-500"
											data-testid="ticket-path-header"
										>
											<p>Ticket Path</p>
										</th>
										<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
											<p>Suggested Departments</p>
										</th>
									</>
								)}
								{(user.is_superuser || user.is_department_head) && (
									<>
										<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
											<p>Suggested Ticket Grouping</p>
										</th>
									</>
								)}
							</>
						}
						data={showingTickets}
						dataName="tickets"
						rowDefinition={(ticket) => (
							<tr key={ticket.id} className="hover:bg-gray-100 cursor-pointer">
								{/* Ticket Information */}
								{['subject', 'status', 'priority'].map((key) => (
									<td
										key={key}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
										onClick={() => {
											setSelectedTicket(ticket);
											openPopup('viewTicket');
										}}
									>
										{ticket[key] || (key === 'priority' ? 'Not Set' : '')}
									</td>
								))}

								{/* Chat Button */}
								<td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex gap-1.5">
									<GenericButton
										className="flex items-center justify-items-center px-2 py-1 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
										onClick={(e) => {
											e.stopPropagation();
											setSelectedTicket(ticket);
											setIsChatOpen(true);
										}}
									>
										<MessageSquareMore className="size-4" />
										Chat
									</GenericButton>
									{user.is_staff && (
										<>
											<GenericButton
												dataTestId="toggle-status"
												className="flex items-center justify-items-center px-2 py-1 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
												onClick={() => toggleChange('status', ticket.id)}
											>
												<RefreshCw className="size-4" />
												Status
											</GenericButton>
											<GenericButton
												dataTestId="toggle-priority"
												className="flex items-center justify-items-center px-2 py-1 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
												onClick={() => toggleChange('priority', ticket.id)}
											>
												<RefreshCw className="size-4" />
												Priority
											</GenericButton>
										</>
									)}
								</td>

								{/* Staff-Specific Actions */}
								{user.is_staff && (
									<>
										{/* Redirect */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<div className="flex items-center gap-2">
												{user.is_superuser ? (
													<DepartmentsDropdown
														setSelectedDepartment={setSelectedDepartment}
													/>
												) : (
													<OfficersDropdown
														officers={officers}
														admin={admin}
														setSelectedOfficer={setSelectedOfficer}
													/>
												)}
												<RedirectButton
													ticketid={ticket.id}
													selectedOfficer={selectedOfficer}
													departmentId={
														user.is_superuser ? selectedDepartment?.id : null
													}
													fetchTickets={fetchTickets}
													setShowingTickets={setShowingTickets}
												/>
											</div>
										</td>

										{/* Change Due Date */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<GenericButton
												className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedTicket(ticket);
													toggleChangeDate();
												}}
											>
												Select Date
											</GenericButton>
										</td>
									</>
								)}

								{/* Superuser-Specific Actions */}
								{user.is_superuser && (
									<>
										{/* Status History Column */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<GenericButton
												dataTestId="status-history-button"
												className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedTicket(ticket);
													setIsHistoryOpen(true);
												}}
											>
												Status History
											</GenericButton>
										</td>

										{/* Ticket Path Column */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<GenericButton
												dataTestId="ticket-path-button"
												className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedTicket(ticket);
													setIsPathOpen(true);
												}}
											>
												Ticket Path
											</GenericButton>
										</td>

										{/* Suggested Departments & Accept Button Column */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<div className="flex item-center gap-2">
												{suggestedDepartments[ticket.id]?.name ||
													'No suggestion'}
												<AcceptButton
													ticketId={ticket.id}
													selectedOfficer={selectedOfficer}
													departmentId={suggestedDepartments[ticket.id]?.id}
												/>
											</div>
										</td>
									</>
								)}

								{(user.is_superuser || user.is_department_head) && (
									<>
										{/* Suggested Grouping & Accept the grouping Column */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<div className="flex item-center gap-2">
												{suggestedGrouping[ticket.id] !== undefined
													? suggestedGrouping[ticket.id]
													: 'No suggestion'}
											</div>
										</td>
									</>
								)}
							</tr>
						)}
					/>
				</div>
			</div>
		</>
	);
};

export default TicketsCard;
