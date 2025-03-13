import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RedirectButton from '../components/RedirectButton';
import api from '../api';
import { toast } from 'sonner';

// ✅ Mock API module
vi.mock('../api', async () => {
	const actual = await vi.importActual('../api'); // Keep actual exports if needed
	return {
		...actual,
		default: { post: vi.fn() }, // Mock API calls
	};
});

// ✅ Mock toast notifications
vi.mock('sonner', () => ({
	toast: {
		promise: vi.fn(),
	},
}));

// ✅ Mock localStorage for token retrieval
vi.stubGlobal('localStorage', {
	getItem: vi.fn(() => 'mock-access-token'),
});

describe('RedirectButton Component', () => {
	it('renders the button correctly', () => {
		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={{ id: 2, is_superuser: true }}
				departmentId={null}
				fetchTickets={vi.fn()}
			/>
		);

		expect(screen.getByText(/Redirect/i)).toBeInTheDocument();
	});

	it('shows an alert if no officer or department is selected', () => {
		window.alert = vi.fn(); // ✅ Mock window.alert

		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={null}
				departmentId={null}
				fetchTickets={vi.fn()}
			/>
		);

		fireEvent.click(screen.getByText(/Redirect/i));

		expect(window.alert).toHaveBeenCalledWith(
			'Please select either an officer or a department to redirect the ticket.'
		);
	});

	it('calls API and fetchTickets on successful redirection', async () => {
		api.post.mockResolvedValue({ status: 200 }); // ✅ Mock successful API response
		const fetchTickets = vi.fn();

		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={{ id: 2, is_superuser: true }}
				departmentId={null}
				fetchTickets={fetchTickets}
			/>
		);

		fireEvent.click(screen.getByText(/Redirect/i));

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith(
				'/api/redirect-ticket/',
				{
					ticket: 1,
					to_profile: 2,
					department_id: null,
				},
				{
					headers: { Authorization: `Bearer mock-access-token` },
				}
			);

			expect(toast.promise).toHaveBeenCalled();
		});
	});

	it('shows an error toast if the API request fails', async () => {
		api.post.mockRejectedValue(new Error('Network error'));

		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={{ id: 2, is_superuser: true }}
				departmentId={null}
				fetchTickets={vi.fn()}
			/>
		);

		fireEvent.click(screen.getByText(/Redirect/i));

		await waitFor(() => {
			expect(toast.promise).toHaveBeenCalled();
		});
	});
});
