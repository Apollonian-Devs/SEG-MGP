import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { ACCESS_TOKEN } from '../../constants';
import api from '../../api';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
	},
}));

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
		vi.spyOn(console, 'error').mockImplementation(() => {});
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

	afterEach(() => {
		vi.restoreAllMocks();
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

	it('fetches and displays officers and admin', async () => {
		api.get.mockImplementationOnce((url) => {
			if (url === '/api/current_user/') {
				return Promise.resolve({
					data: { username: 'StaffUser', is_staff: true, is_superuser: false },
				});
			}
			return Promise.reject(new Error('Unknown API call'));
		});

		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(api.get).toHaveBeenCalledWith(
				'/api/all-officers/',
				expect.any(Object)
			);
			expect(api.get).toHaveBeenCalledWith(
				'/api/user-tickets/',
				expect.any(Object)
			);
		});
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
});

describe('Dashboard API error handling', () => {
	test('shows toast error(response) when fetching current user fails', async () => {
	  vi.spyOn(api, 'get').mockRejectedValueOnce({
		response: { data: 'Server error while fetching current user' },
	  });
  
	  render(<Dashboard />);
  
	  await waitFor(() => {
		// Expect the prefixed error message
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching current user');
	  });
	});
  
	test('shows toast error(message) when fetching current user fails', async () => {
	  vi.spyOn(api, 'get').mockRejectedValueOnce({
		message: 'Server error while fetching current user',
	  });
  
	  render(<Dashboard />);
  
	  await waitFor(() => {
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching current user');
	  });
	});
  
	test('logs an error(response) when fetching officers & tickets fails', async () => {
	  vi.spyOn(api, 'get')
		.mockResolvedValueOnce({
		  data: { username: 'test_user', is_staff: true, is_superuser: false },
		}) // current user succeeds
		.mockRejectedValueOnce({
		  response: { data: 'Server error while fetching tickets' },
		}) // tickets error
		.mockRejectedValueOnce({
		  response: { data: 'Unable to fetch officers' },
		}); // officers error
  
	  render(<Dashboard />);
  
	  await waitFor(() => {
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching tickets');
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching officers');
	  });
	});
  
	test('logs an error(message) when fetching officers & tickets fails', async () => {
	  vi.spyOn(api, 'get')
		.mockResolvedValueOnce({
		  data: { username: 'test_user', is_staff: true, is_superuser: false },
		})
		.mockRejectedValueOnce({
		  message: 'Server error while fetching tickets',
		}) 
		.mockRejectedValueOnce({
		  message: 'Unable to fetch officers',
		}); 
  
	  render(<Dashboard />);
  
	  await waitFor(() => {
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching tickets');
		expect(toast.error).toHaveBeenCalledWith('❌ Error fetching officers');
	  });
	});
  });
  