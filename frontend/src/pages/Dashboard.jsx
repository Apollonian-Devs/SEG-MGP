import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import TicketsCard from '../components/TicketsCard';
import NewTicketButton from '../components/NewTicketButton';
import GenericDropdown from '../components/GenericDropdown';
import NotificationsTab from '../components/Notification';
import TicketDetails from '../components/TicketDetails';
import Popup from '../components/Popup';
import { CircleUserRound } from 'lucide-react';
import GenericButton from '../components/GenericButton';

const Dashboard = () => {
	const [current_user, setCurrent_user] = useState(null);
	const [officers, setOfficers] = useState([]);
	const [admin, setAdmin] = useState(null);
	const [popupType, setPopupType] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [isPopupOpen, setPopupOpen] = useState(false);


	const [lightMode, setLightMode] = useState(() => {
		return localStorage.getItem("lightMode") === "false" ? false : true;
	  });
	
	  // Save mode in localStorage and apply dark mode class
	  useEffect(() => {
		localStorage.setItem("lightMode", lightMode);
		document.documentElement.classList.toggle("dark", !lightMode);
	  }, [lightMode]);


	const fetchCurrentUser = async () => {
		try {
			const access = localStorage.getItem(ACCESS_TOKEN);
			const response = await api.get('/api/current_user/', {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			});
			console.log('Current User:', response.data);
			setCurrent_user(response.data); // No need to manually restructure the object
		} catch (error) {
			console.error(
				'Error fetching current user:',
				error.response?.data || error.message
			);
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
			console.log('All Officers', response.data);
			setOfficers(response.data.officers); // No need to manually restructure the object
			setAdmin(response.data.admin);
		} catch (error) {
			console.error(
				'Error fetching officers',
				error.response?.data || error.message
			);
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
		}
	};

	const openPopup = (type, ticket = null) => {
		setPopupType(type);
		// setSelectedTicket(ticket);
		setPopupOpen(true);
	};

	const closePopup = () => {
		setPopupOpen(false);
		setPopupType(null);
		setSelectedTicket(null);
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
		<div className="min-h-screen w-full flex flex-col items-center transition-colors duration-500">
		{/* Dark Mode Toggle */}
		<div className="flex justify-center py-6">
		  <GenericButton
			onClick={() => setLightMode(!lightMode)}
			className="bg-red-500 text-white px-4 py-2 rounded-md"
		  >
			{lightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
		  </GenericButton>
		</div>


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
					{!current_user.is_staff && <NewTicketButton />}
					<NotificationsTab user={current_user} />
				</div>
			</div>

			<div className="bg-white text-black p-6 rounded-xl shadow-lg">
			<TicketsCard
				user={current_user}
				officers={
					current_user.is_staff && !current_user.is_superuser ? officers : []
				}
				admin={admin}
				openPopup={openPopup}
				tickets={tickets}
				setTickets={setTickets}
				selectedTicket={selectedTicket}
				setSelectedTicket={setSelectedTicket}
				fetchTickets={fetchTickets}
			/>
			</div>

			<Popup isOpen={isPopupOpen} onClose={closePopup}>
				{popupType === 'addTicket' && <AddTicketPopup />}
				{popupType === 'viewTicket' && selectedTicket && (
					<TicketDetails ticket={selectedTicket} />
				)}
			</Popup>
		</div>
	</div>
	);
};

export default Dashboard;
