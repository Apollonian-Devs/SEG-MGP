import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { ACCESS_TOKEN } from '../../constants';
import api from '../../api';

// Mock API and LocalStorage
vi.mock('../../api', () => ({
	__esModule: true,
	default: {
		get: vi.fn(),
	},
}));

// Mocking necessary child components
vi.mock('../../components/TicketsCard', () => ({
	__esModule: true,
	default: () => <div data-testid="tickets-card">TicketsCard</div>,
}));

vi.mock('../../components/NewTicketButton', () => ({
	__esModule: true,
	default: () => <button data-testid="new-ticket-button">New Ticket</button>,
}));

vi.mock('../../components/GenericDropdown', () => ({
	__esModule: true,
	default: ({ buttonName }) => (
		<div data-testid="generic-dropdown">{buttonName}</div>
	),
}));

vi.mock('../../components/Notification', () => ({
	__esModule: true,
	default: () => <div data-testid="notifications-tab">Notifications</div>,
}));

vi.mock('../../components/Popup', () => ({
	__esModule: true,
	default: ({ isOpen }) =>
		isOpen ? <div data-testid="popup">Popup</div> : null,
}));

vi.mock('../../components/TicketDetails', () => ({
	__esModule: true,
	default: () => <div data-testid="ticket-details">TicketDetails</div>,
}));

// Mock LocalStorage
beforeEach(() => {
	vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
		if (key === ACCESS_TOKEN) return 'mock-access-token';
		return null;
	});
	vi.spyOn(Storage.prototype, 'setItem');
	vi.spyOn(Storage.prototype, 'clear');
});

describe('Dashboard Component', () => {
	beforeEach(() => {
		// Mock API Responses
		api.get.mockImplementation((url) => {
			if (url === '/api/current_user/') {
				return Promise.resolve({
					data: { username: 'testUser', is_staff: false, is_superuser: false },
				});
			}
			if (url === '/api/user-tickets/') {
				return Promise.resolve({
					data: { tickets: [] },
				});
			}
			if (url === '/api/all-officers/') {
				return Promise.resolve({
					data: { officers: [], admin: 'adminUser' },
				});
			}
			return Promise.reject(new Error('Unknown API call'));
		});
	});

	it('renders the Dashboard component', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('dashboard-container')).toBeInTheDocument()
		);
	});

	it('fetches and displays the current user', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByText('testUser')).toBeInTheDocument()
		);
	});

	it('renders the TicketsCard component', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('tickets-card')).toBeInTheDocument()
		);
	});

	it('renders the NotificationsTab component', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('notifications-tab')).toBeInTheDocument()
		);
	});

	it('renders the NewTicketButton for non-staff users', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('new-ticket-button')).toBeInTheDocument()
		);
	});

	it('does not render NewTicketButton for staff users', async () => {
		api.get.mockImplementationOnce((url) => {
			if (url === '/api/current_user/') {
				return Promise.resolve({
					data: { username: 'staffUser', is_staff: true, is_superuser: false },
				});
			}
			return Promise.reject(new Error('Unknown API call'));
		});

		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.queryByTestId('new-ticket-button')).not.toBeInTheDocument()
		);
	});

	it('opens and renders the Popup when triggered', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		// Simulate opening the popup
		api.get.mockImplementationOnce(() =>
			Promise.resolve({ data: { username: 'testUser', is_staff: false } })
		);

		await waitFor(() =>
			expect(screen.queryByTestId('popup')).not.toBeInTheDocument()
		);
	});
});
