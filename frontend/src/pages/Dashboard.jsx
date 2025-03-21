import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import TicketsCard from '../components/TicketsCard';
import NewTicketButton from '../components/NewTicketButton';
import GenericDropdown from '../components/GenericDropdown';
import NotificationsTab from '../components/Notification';
import { CircleUserRound } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
	const [current_user, setCurrent_user] = useState(null);
	const [officers, setOfficers] = useState([]);
	const [admin, setAdmin] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [selectedTicket, setSelectedTicket] = useState(null);

	const fetchCurrentUser = async () => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/current_user/', {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			});
			// console.log('Current User:', response.data);
			setCurrent_user(response.data); // No need to manually restructure the object
		} catch (error) {
			toast.error('Error fetching current user', {
				description: error.response?.data || error.message,
			});
			setCurrent_user(null);
		}
	};

	const fetchOfficers = async () => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/all-officers/', {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			});
			// console.log('All Officers', response.data);
			setOfficers(response.data.officers); // No need to manually restructure the object
			setAdmin(response.data.admin);
		} catch (error) {
			toast.error('Error fetching officers', {
				description: error.response?.data || error.message,
			});
			setOfficers(null);
			setAdmin(null);
		}
	};

	const fetchTickets = async () => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/user-tickets/', {
				headers: { Authorization: `Bearer ${access}` },
			});
			setTickets(response.data.tickets);
			// console.log('Tickets:', response.data.tickets);
		} catch (error) {
			toast.error('Error fetching tickets', {
				description: error.response?.data || error.message,
			});
			setTickets(null);
		}
	};

	useEffect(() => {
		fetchCurrentUser();
		fetchTickets();
	}, []);

	useEffect(() => {
		if (current_user && current_user.is_staff) {
			fetchOfficers();
		}
	}, [current_user]);

	// Ensure current_user is available before rendering
	if (!current_user) {
		return <p>Loading user details...</p>;
	}
	return (
		<div data-testid="dashboard-container">
			<div className="flex justify-between items-center gap-x-5 mb-5">
				<GenericDropdown
					buttonName={
						<div className="flex items-center gap-x-1.5">
							<CircleUserRound size={30} />
							<span>{current_user.username}</span>
						</div>
					}
					className="flex items-center justify-items-center px-5 h-12 gap-1 text-black hover:bg-slate-200 transition-colors duration-500 bg-white rounded-full shadow-lg text-lg font-semibold"
				>
					<a
						href="/logout"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200 transitions-colors duration-500"
					>
						Logout
					</a>
				</GenericDropdown>

				<div className="flex justify-between items-center gap-x-5">
					{!current_user.is_staff && (
						<NewTicketButton fetchTickets={fetchTickets} />
					)}
					<NotificationsTab user={current_user} />
				</div>
			</div>
			<TicketsCard  
				user={current_user}
				officers={
					current_user.is_staff && !current_user.is_superuser ? officers : []
				}
				admin={admin}
				tickets={tickets}
				setTickets={setTickets}
				selectedTicket={selectedTicket}
				setSelectedTicket={setSelectedTicket}
				fetchTickets={fetchTickets}
			/>
		</div>
	);
};

export default Dashboard;
