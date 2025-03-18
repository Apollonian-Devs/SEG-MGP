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
			/>
		);

		expect(screen.getByText(/Redirect/i)).toBeInTheDocument();
	});


	it('calls the API when the button is clicked and the officer is selected', async () => {
		api.post.mockResolvedValue({ status: 200 });
		const mockFetchTickets = vi.fn();

		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={{ id: 2, is_superuser: true }}
				departmentId={null}
				fetchTickets={mockFetchTickets}
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
					headers: { Authorization: 'Bearer mock-access-token' }, 
				}
			);

			expect(toast.promise).toHaveBeenCalled(); 
		});
	});

	it('calls the API when the button is clicked and the department is selected', async () => {
		api.post.mockResolvedValue({ status: 200 });
		const mockFetchTickets = vi.fn();

		render(
			<RedirectButton
				ticketid={1}
				selectedOfficer={null}
				departmentId={2}
				fetchTickets={mockFetchTickets}
			/>
		);

		fireEvent.click(screen.getByText(/Redirect/i));

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith(
				'/api/redirect-ticket/',
				{
					ticket: 1,
					to_profile: null, 
					department_id: 2,
				},
				{
					headers: { Authorization: 'Bearer mock-access-token' }, 
				}
			);

			expect(toast.promise).toHaveBeenCalled(); 
		});
	});


});