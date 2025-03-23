import React, { useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup';
import GenericTable from './GenericTable';
import GenericButton from './GenericButton';
import { playSound } from "../utils/SoundUtils";
import handleApiError from '../utils/errorHandler';
import { getWithAuth } from '../utils/apiUtils';
import { postWithAuth } from '../utils/apiUtils';
const NotificationsTab = ({ user }) => {
	const [notifications, setNotifications] = useState([]);
	const [isPopupOpen, setShowNotifications] = useState(false);
	const [clickedNotifications, setClickedNotifications] = useState(new Set());

	const fetchNotifications = async () => {
		try {
			const response = await getWithAuth('/api/user-notifications/');
			setNotifications(response.data.notifications);
		} catch (error) {
			handleApiError(error, "Error fetching notifications");
		}
	};

	const markNotificationAsRead = async (notificationId, access) => {
		try {
			await postWithAuth(`/api/user-notifications/`, { id: notificationId });
		} catch (error) {
			handleApiError(error, `Error marking notification ${notificationId} as read`);
		}
	};
	
	const markSetAsRead = async () => {
		if (clickedNotifications.size === 0) return;
	
		const access = localStorage.getItem(ACCESS_TOKEN);
	
		await Promise.all(
			[...clickedNotifications].map((notificationId) => 
				markNotificationAsRead(notificationId, access)
			)
		);
	};
	

	const handleNotificationClick = (id) => {
		setClickedNotifications((prev) => {
			const newClicked = new Set(prev);
			const wasClicked = newClicked.has(id);
			wasClicked ? newClicked.delete(id) : newClicked.add(id);
			return newClicked;
		});
	};

	const markAllRead = () => {
		setClickedNotifications(new Set(notifications.map((item) => item.id)));
	};

	const toggleNotifications = () => {
		if (!isPopupOpen) {
			fetchNotifications();
		} else {
			markSetAsRead();
		}
		setShowNotifications(!isPopupOpen);
	};
	return (
		<>
			<GenericButton
				className="flex items-center justify-items-center px-5 h-12 gap-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-full shadow-lg"
				onClick={() => {
					playSound();
					toggleNotifications();
				}}
			>
				<FontAwesomeIcon icon={faBell} />
			</GenericButton>

			<Popup
				isOpen={isPopupOpen}
				onClose={toggleNotifications}
				width="w-[80%]"
				height="h-[80%]"
			>
				<GenericButton
					className="absolute top-4 left-4 w-20 h-10 bg-customOrange-dark hover:bg-customOrange-light text-white rounded-md"
					onClick={markAllRead}
				>
					Read All
				</GenericButton>
				<div className="px-10 py-16 overflow-hidden">
					<GenericTable
						columnDefinition={[
							<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
								Subject
							</th>,
							<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
								Message
							</th>,
							<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
								Created at
							</th>,
							<th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
								Read status
							</th>,
						]}
						data={notifications}
						dataName="notifications"
						rowDefinition={(notification) => (
							<tr
								key={notification.id}
								className={`${clickedNotifications.has(notification.id) ? 'bg-green-200' : 'bg-red-200'}  cursor-pointer`}
								onClick={() => handleNotificationClick(notification.id)}
							>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
									{notification.ticket_subject}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{notification.message}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{notification.created_at || 'Not Set'}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{notification.read_Status || 'Not Set'}
								</td>
							</tr>
						)}
					/>
				</div>
			</Popup>
		</>
	);
};

export default NotificationsTab;
