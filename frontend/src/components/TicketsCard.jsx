import React, { useState, useEffect } from 'react';

// Import Icons
import {
	MessageSquareMore,
	RefreshCw,
	MoreVertical,
	View,
	Pen,
	CheckCircle,
	AlertCircle,
	Clock,
	XCircle,
	Sparkles,
} from 'lucide-react';

// Import Components:
// Buttons
import Chat from './Chat';
import GenericButton from './genericComponents/GenericButton';
import RedirectButton from './RedirectButton';
import SuggestDepartmentButton from './SuggestDepartmentButton';
import StatusHistoryButton from './StatusHistoryButton';
import SuggestTicketGroupingButton from './SuggestTicketGroupingButton';
import TicketPathButton from './TicketPathButton';

// Dropdowns
import GenericDropdown from './genericComponents/GenericDropdown';
import OfficersDropdown from './OfficersDropdown';
import DepartmentsDropdown from './DepartmentsDropdown';
import FilterTicketsDropdown from './FilterTicketsDropdown';

import PopUp from './Popup';
import GenericTable from './genericComponents/GenericTable';
import ChangeDate from './ChangeDate';
import TicketDetails from './TicketDetails';

// Utils
import {formatApiErrorMessage} from '../utils/errorHandler';
import {getWithAuth} from '../utils/apiUtils';
import{handleToastPromise} from '../utils/toastUtils';


/**
 * @component
 * TicketsCard - A card component that displays a list of tickets with filtering, sorting, and various actions like redirecting, chatting, and updating ticket status.
 *
 * @props
 * - user (object): The logged-in user with role-specific permissions.
 * - officers (array): List of officers available for ticket assignment.
 * - admin (object | null): The admin user for handling specific ticket actions.
 * - tickets (array): The list of tickets to display.
 * - setTickets (function): A function to update the ticket list.
 * - selectedTicket (object | null): The currently selected ticket.
 * - setSelectedTicket (function): A function to set the currently selected ticket.
 * - fetchTickets (function): A function to fetch the updated ticket list after actions.
 *
 * @state
 * - showingTickets (array): The filtered and sorted list of tickets to display.
 * - isChatOpen (boolean): Controls whether the chat popup is open.
 * - selectedOfficers (object): Stores the selected officer for each ticket.
 * - isChangeDateOpen (boolean): Controls whether the change date popup is open.
 * - isHistoryOpen (boolean): Controls whether the status history popup is open.
 * - isPathOpen (boolean): Controls whether the ticket path popup is open.
 * - isDetailOpen (boolean): Controls whether the ticket details popup is open.
 * - selectedDepartments (object): Stores the selected departments for tickets.
 * - suggestedDepartments (object): Stores the suggested departments for tickets.
 * - suggestedGrouping (object): Stores the suggested ticket groupings.
 * - priority (string): The selected priority filter for tickets.
 * - status (string): The selected status filter for tickets.
 * - isOverdue (boolean): The selected overdue filter for tickets.
 * - sortConfig (object): Configuration for sorting tickets by specific columns.
 *
 * @methods
 * - handleSelectOfficer(ticketId, officer): Sets the selected officer for a ticket.
 * - toggleChange(type, ticket_id): Toggles the change for priority or status of a ticket.
 * - sortTickets(key): Sorts the tickets by the specified key (subject, status, priority).
 * - applyFilters(): Applies the filters to the list of tickets.
 * - clearFilters(): Clears the applied filters and shows all tickets.
 * - toggleChangeDate(): Toggles the change date popup visibility.
 *
 * @returns {JSX.Element}
 */

const TicketsCard = ({
	user,
	officers,
	admin,
	tickets,
	setTickets,
	selectedTicket,
	setSelectedTicket,
	fetchTickets,
}) => {
	// States
	const [showingTickets, setShowingTickets] = useState(tickets);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedOfficers, setSelectedOfficers] = useState({});
	const [isChangeDateOpen, setChangeDateOpen] = useState(null);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [isPathOpen, setIsPathOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [selectedDepartments, setSelectedDepartments] = useState({});
	const [suggestedDepartments, setSuggestedDepartments] = useState({});
	const [suggestedGrouping, setSuggestedGrouping] = useState({});
	const [priority, setPriority] = useState('');
	const [status, setStatus] = useState('');
	const [isOverdue, setIsOverdue] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	// Icon mapping
	const statusIconMapping = {
		Open: <Clock className="size-4 text-blue-500" />,
		'In Progress': <AlertCircle className="size-4 text-yellow-500" />,
		Closed: <CheckCircle className="size-4 text-green-500" />,
		'Awaiting Student': <XCircle className="size-4 text-red-500" />,
	};

	// Colour mapping
	const priorityColorBackground = (priorityType) => {
		switch (priorityType) {
			case 'High':
				return 'bg-red-500 text-white';
			case 'Medium':
				return 'bg-yellow-500 text-white';
			case 'Low':
				return 'bg-green-500 text-white';
			default:
				return 'bg-gray-300 text-black';
		}
	};

	// Methods
	const handleSelectOfficer = (ticketId, officer) => {
		setSelectedOfficers((prev) => ({
			...prev,
			[ticketId]: officer,
		}));
	};

	const toggleChange = async (type, ticket_id) => {
		const path = type === 'priority' ? 'change-priority' : 'change-status';
		const toggleChangePromise = getWithAuth(`/api/tickets/${path}/${ticket_id}/`);
		
		handleToastPromise(toggleChangePromise, {
			loading: 'Changing...',
			successMessage: `${type} changed successfully!`,
			successCallback: fetchTickets,
			errorCallback: (error) =>
				`Error changing ${type}: ${formatApiErrorMessage(error, "Something went wrong", { includePrefix: false })}`,
		});
	};

	const sortTickets = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sortedTickets = [...showingTickets].sort((a, b) => {
			const valueA = a[key] ?? ''; 
			const valueB = b[key] ?? '';

			return (
				(valueA < valueB ? -1 : valueA > valueB ? 1 : 0) *
				(direction === 'asc' ? 1 : -1)
			);
		});

		setShowingTickets(sortedTickets);
	};

	const applyFilters = () => {
		if (!tickets || tickets.length === 0) {
			setShowingTickets([]);
			return;
		}

		const filteredTickets = tickets.filter((ticket) => {
			if (priority && ticket.priority !== priority) {
				return false;
			}
			if (status && ticket.status !== status) {
				return false;
			}
			if (isOverdue && !ticket.is_overdue) {
				return false;
			}

			return true;
		});

		setShowingTickets(filteredTickets);
	};

	const clearFilters = () => {
		setPriority('');
		setStatus('');
		setIsOverdue(false);

		setShowingTickets(tickets);
	};

	const toggleChangeDate = () => {
		setChangeDateOpen((prev) => !prev);
	};

	useEffect(() => {
		applyFilters();
	}, [tickets]);

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
								fetchTickets={fetchTickets}
							/>
						</PopUp>

						<PopUp
							isOpen={isDetailOpen}
							onClose={() => {
								setSelectedTicket(null);
								setIsDetailOpen(false);
							}}
							width="w-fit min-w-[30%] max-w-[60%]"
							height="h-fit"
						>
							<TicketDetails ticket={selectedTicket} />
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
								fetchTickets={fetchTickets}
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
								priority={priority}
								status={status}
								isOverdue={isOverdue}
								setPriority={setPriority}
								setStatus={setStatus}
								setIsOverdue={setIsOverdue}
								applyFilters={applyFilters}
								clearFilters={clearFilters}
								dataTestId="filter-tickets-dropdown"
							/>
							{/* AI-powered suggestion dropdown */}
							{user.is_staff &&
								(user.is_superuser || user.is_department_head) && (
									<GenericDropdown
										className="inline-flex items-center justify-center gap-2 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md px-3 py-1 h-10"
										showArrow={false}
										buttonName={
											<div className="flex items-center gap-2">
												<Sparkles className="size-5" />
												<span>AI Suggestion</span>
											</div>
										}
									>
										{/* Suggest Department Button (Only for Superuser Staff) */}
										{user.is_superuser && (
											<div className="flex justify-end px-2 py-1">
												<SuggestDepartmentButton
													setSuggestedDepartments={setSuggestedDepartments}
													tickets={tickets}
												/>
											</div>
										)}

										{/* Group Tickets Button (For department heads and admins (superusers)) */}
										{(user.is_department_head || user.is_superuser) && (
											<div className="flex justify-end px-2 py-1">
												<SuggestTicketGroupingButton
													setSuggestedGrouping={setSuggestedGrouping}
													tickets={tickets}
												/>
											</div>
										)}
									</GenericDropdown>
								)}
						</div>
					</div>

					<GenericTable
						columnDefinition={
							<>
								{['Subject', 'Status', 'Priority'].map((header) => (
									<th
										key={header}
										className="px-6 py-3 text-start text-xs font-medium cursor-pointer"
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

								<th className="px-6 py-3 text-end text-xs font-medium">
									<p>Actions</p>
								</th>

								{user.is_staff && (
									<>
										<th className="px-6 py-3 text-end text-xs font-medium">
											<p>Redirect</p>
										</th>
									</>
								)}

								{user.is_superuser && (
									<>
										<th className="px-6 py-3 text-end text-xs font-medium">
											<p>Suggested Departments</p>
										</th>
									</>
								)}
								{(user.is_superuser || user.is_department_head) && (
									<>
										<th className="px-6 py-3 text-end text-xs font-medium">
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
										className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${key === 'subject' ? 'max-w-52 truncate' : ''}`}
										onClick={() => {
											setSelectedTicket(ticket);
											setIsDetailOpen(true);
										}}
									>
										{key === 'status' ? (
											<div className="flex items-center gap-2">
												{statusIconMapping[ticket[key]]}
												{ticket[key] || 'Not Set'}
											</div>
										) : key === 'priority' ? (
											<div className={`px-3 py-1 rounded-full text-center ${priorityColorBackground(ticket[key])}`}>
												{ticket[key] || 'Not Set'}
											</div>
										) : (
											ticket[key]
										)}
									</td>
								))}

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
									{/* Only show for staff */}
									{user.is_staff && (
										<>
											{/* Status Button */}
											<GenericButton
												dataTestId="toggle-status"
												className="flex items-center justify-items-center px-2 py-1 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
												onClick={() => toggleChange('status', ticket.id)}
											>
												<RefreshCw className="size-4" />
												Status
											</GenericButton>

											{/* Priority Button */}
											<GenericButton
												dataTestId="toggle-priority"
												className="flex items-center justify-items-center px-2 py-1 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
												onClick={() => toggleChange('priority', ticket.id)}
											>
												<RefreshCw className="size-4" />
												Priority
											</GenericButton>

											{/* More Actions Dropdown */}
											<GenericDropdown
												buttonName={
													<MoreVertical className="size-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
												}
												className="flex items-center justify-center px-1 py-1 gap-1"
												showArrow={false}
												dataTestId="more-actions-dropdown"
											>
												<div className="flex flex-col space-y-2 p-2">
													{/* Change Due Date */}
													<GenericButton
														className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 inline-flex items-center"
														onClick={(e) => {
															e.stopPropagation();
															setSelectedTicket(ticket);
															toggleChangeDate();
														}}
													>
														<Pen className="mr-2 size-4" />
														Change Due Date
													</GenericButton>

													{/* Superuser-Specific Actions */}
													{user.is_superuser && (
														<>
															{/* Status History Button */}
															<GenericButton
																dataTestId="status-history-button"
																className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 inline-flex items-center"
																onClick={(e) => {
																	e.stopPropagation();
																	setSelectedTicket(ticket);
																	setIsHistoryOpen(true);
																}}
															>
																<View className="mr-2 size-4" />
																Status History
															</GenericButton>

															{/* Ticket Path Button */}
															<GenericButton
																dataTestId="ticket-path-button"
																className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 inline-flex items-center"
																onClick={(e) => {
																	e.stopPropagation();
																	setSelectedTicket(ticket);
																	setIsPathOpen(true);
																}}
															>
																<View className="mr-2 size-4" />
																Ticket Path
															</GenericButton>
														</>
													)}
												</div>
											</GenericDropdown>
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
														ticketId={ticket.id}
														setSelectedDepartments={setSelectedDepartments}
													/>
												) : (
													<OfficersDropdown
														ticketId={ticket.id}
														officers={officers}
														admin={admin}
														onSelectOfficer={handleSelectOfficer}
													/>
												)}
												<RedirectButton
													ticketid={ticket.id}
													selectedOfficer={selectedOfficers[ticket.id]}
													departmentId={
														user.is_superuser
															? selectedDepartments[ticket.id]?.id
															: null
													}
													fetchTickets={fetchTickets}
												/>
											</div>
										</td>

										{/* Suggested Departments & Accept Button Column (Only for Superusers) */}
										{user.is_superuser && (
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
												<div className="flex items-center justify-between gap-2">
													{suggestedDepartments[ticket.id]?.name ||
														'No suggestion'}
													<RedirectButton
														ticketid={ticket.id}
														selectedOfficer={selectedOfficers[ticket.id]}
														departmentId={suggestedDepartments[ticket.id]?.id}
														fetchTickets={fetchTickets}
														setShowingTickets={setShowingTickets}
														dataTestId="suggested-redirect-button"
													/>
												</div>
											</td>
										)}
									</>
								)}

								{(user.is_superuser || user.is_department_head) && (
									<>
										{/* Suggested Grouping & Accept the grouping Column */}
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
											<div className="flex item-center gap-2">
												{suggestedGrouping[ticket.id] || 'No suggestion'}
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
