import React, { useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Chat from './Chat';
import GenericButton from './GenericButton';
import PopUp from './Popup';
import GenericTable from './GenericTable';
import OfficersDropdown from './OfficersDropdown';
import RedirectButton from './RedirectButton';
import { RefreshCw, MessageSquareMore } from 'lucide-react';

const TicketsCard = ({ user, officers, openPopup }) => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedOfficer, setSelectedOfficer] = useState(null);

	// Sorting State
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

	const fetchTickets = async () => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/user-tickets/', {
				headers: { Authorization: `Bearer ${access}` },
			});
			setTickets(response.data.tickets);
			console.log('Tickets:', response.data.tickets);
		} catch (error) {
			console.error(
				'Error fetching tickets:',
				error.response?.data || error.message
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTickets();
	}, []);

	// Sorting Function
	const sortTickets = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sortedTickets = [...tickets].sort((a, b) => {
			const valueA = a[key] ?? ''; // Treat null/undefined as an empty string
			const valueB = b[key] ?? '';

			return (
				(valueA < valueB ? -1 : valueA > valueB ? 1 : 0) *
				(direction === 'asc' ? 1 : -1)
			);
		});

		setTickets(sortedTickets);
	};

	if (loading) {
		return <p>Loading tickets...</p>;
	}

	return (
		<>
			<div className="relative">
				{selectedTicket && (
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
				)}
			</div>
			<div className="flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
				<div className="-m-1.5 overflow-x-auto">
					<div className="p-10 min-w-full inline-block align-middle">
						<h1 className="flex w-full text-center mb-5">Tickets</h1>
						<div>
							<GenericTable
								columnDefinition={
									<>
										<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer">
											<GenericButton
												className="flex items-center w-full gap-x-1"
												onClick={() => sortTickets('subject')}
											>
												<p>Subject</p>
												{sortConfig.key === 'subject'
													? sortConfig.direction === 'asc'
														? '▲'
														: '▼'
													: ''}
											</GenericButton>
										</th>
										<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer">
											<GenericButton
												className="flex items-center w-full gap-x-1"
												onClick={() => sortTickets('status')}
											>
												<p>Status</p>
												{sortConfig.key === 'status'
													? sortConfig.direction === 'asc'
														? '▲'
														: '▼'
													: ''}
											</GenericButton>
										</th>
										<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase cursor-pointer">
											<GenericButton
												className="flex items-center w-full gap-x-1"
												onClick={() => sortTickets('priority')}
											>
												<p>Priority</p>
												{sortConfig.key === 'priority'
													? sortConfig.direction === 'asc'
														? '▲'
														: '▼'
													: ''}
											</GenericButton>
										</th>
										<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
											<p>Actions</p>
										</th>
										{user.is_staff && (
											<th className="px-6 py-3 text-end text-xs font-medium text-gray-500">
												<p>Redirect</p>
											</th>
										)}
									</>
								}
								data={tickets}
								dataName="tickets"
								rowDefinition={(ticket) => (
									<tr
										key={ticket.id}
										className="hover:bg-gray-100 cursor-pointer"
									>
										<td
											className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
											onClick={() => openPopup('viewTicket', ticket)}
										>
											{ticket.subject}
										</td>
										<td
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
											onClick={() => openPopup('viewTicket', ticket)}
										>
											{ticket.status}
										</td>
										<td
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
											onClick={() => openPopup('viewTicket', ticket)}
										>
											{ticket.priority || 'Not Set'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex items-center justify-between gap-2">
											{!user.is_superuser && (
												<GenericButton
													className="flex items-center justify-items-center px-2 py-1 gap-2 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-full"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedTicket(ticket);
														setIsChatOpen(true);
													}}
												>
													<MessageSquareMore className="size-4" />
													Chat
												</GenericButton>
											)}

											{user.is_superuser && (
												<>
													<GenericButton
														className="flex items-center justify-items-center px-2 py-1 gap-2 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-full"
														onClick={() => toggleChange('status', ticket.id)}
													>
														<RefreshCw className="size-4" />
														Status
													</GenericButton>
													<GenericButton
														className="flex items-center justify-items-center px-2 py-1 gap-2 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-full"
														onClick={() => toggleChange('priority', ticket.id)}
													>
														<RefreshCw className="size-4" />
														Priority
													</GenericButton>
												</>
											)}
										</td>
										{user.is_staff && (
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
												<div className="flex items-center gap-2">
													<OfficersDropdown
														officers={officers}
														setSelectedOfficer={setSelectedOfficer}
													/>
													<RedirectButton
														ticketid={ticket.id}
														selectedOfficer={selectedOfficer}
													/>
												</div>
											</td>
										)}
									</tr>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TicketsCard;
