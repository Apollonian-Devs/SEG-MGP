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
import { MessageSquareMore, RefreshCw, MoreVertical, View, Pen, CheckCircle, AlertCircle, Clock, XCircle  } from 'lucide-react';
import FilterTicketsDropdown from './FilterTicketsDropdown';
import GenericDropdown from './GenericDropdown';

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

	// Filtering State
	const [priority, setPriority] = useState('');
	const [status, setStatus] = useState('');
	const [isOverdue, setIsOverdue] = useState(false);

	// Sorting State
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	// Icon mapping
	const statusIconMapping = {
		'Open': <Clock className="size-4 text-blue-500" />,
		'In Progress': <AlertCircle className="size-4 text-yellow-500" />,
		'Closed': <CheckCircle className="size-4 text-green-500" />,
		'Awaiting Student': <XCircle className="size-4 text-red-500" />,
	  };

	useEffect(() => {
		applyFilters(); // setShowingTickets is included in applyFilters
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

	// Filtering Functions
	const applyFilters = () => {
		if (!tickets || tickets.length === 0) {
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
								priority={priority}
								status={status}
								isOverdue={isOverdue}
								setPriority={setPriority}
								setStatus={setStatus}
								setIsOverdue={setIsOverdue}
								applyFilters={applyFilters}
								clearFilters={clearFilters}
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
									</>
								)}

								{user.is_superuser && (
									<>
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
									{key === 'status' ? (
									<div className="flex items-center gap-2">
										{statusIconMapping[ticket[key]]}
										{ticket[key] || 'Not Set'}
									</div>
									) : (
									ticket[key] || (key === 'priority' ? 'Not Set' : '')
									)}
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
											buttonName={<MoreVertical className="size-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />}
											className="flex items-center justify-center px-1 py-1 gap-1"
											showArrow={false}
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
