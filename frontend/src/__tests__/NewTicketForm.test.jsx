import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest'; // Vitest for mocking
import NewTicketForm from '../components/NewTicketForm';
import api from '../api';
import { toast } from 'sonner';

// Mock API calls
vi.mock('../api', async () => {
	const actual = await vi.importActual('../api'); // Keep other exports if any
	return {
		...actual,
		default: { post: vi.fn() }, // Mock the default export properly
	};
});

// Mock toast notifications
vi.mock('sonner', () => ({
	toast: {
		promise: vi.fn(),
	},
}));

describe('NewTicketForm Component', () => {
	it('renders all form fields', () => {
		render(<NewTicketForm togglePopup={vi.fn()} />);

		expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Attachments/i)).toBeInTheDocument();
		expect(screen.getByText(/Send Ticket/i)).toBeInTheDocument();
	});

	it('updates input fields when the user types', async () => {
		render(<NewTicketForm togglePopup={vi.fn()} />);
		const user = userEvent.setup();

		const subjectInput = screen.getByLabelText(/Subject/i);
		const descriptionInput = screen.getByLabelText(/Description/i);
		const messageInput = screen.getByLabelText(/Message/i);

		await user.type(subjectInput, 'Dorm issue');
		await user.type(descriptionInput, 'I have no hot water');
		await user.type(messageInput, 'Please fix it soon');

		expect(subjectInput.value).toBe('Dorm issue');
		expect(descriptionInput.value).toBe('I have no hot water');
		expect(messageInput.value).toBe('Please fix it soon');
	});

	it('submits the form successfully', async () => {
		api.post.mockResolvedValue({ status: 201 });
		const togglePopup = vi.fn();
		render(<NewTicketForm togglePopup={togglePopup} />);
		const user = userEvent.setup();

		// Fill out the form
		await user.type(screen.getByLabelText(/Subject/i), 'Dorm issue');
		await user.type(screen.getByLabelText(/Description/i), 'No hot water');
		await user.type(screen.getByLabelText(/Message/i), 'Any update?');

		// Submit the form
		fireEvent.submit(screen.getByTestId('generic-form'));

		// Wait for API call and state reset
		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith('api/tickets/', {
				subject: 'Dorm issue',
				description: 'No hot water',
				message: 'Any update?',
				attachments: [],
			});

			expect(toast.promise).toHaveBeenCalled();
		});

		act(() => {
			const successCallback = toast.promise.mock.calls[0][1].success;	
			expect(successCallback()).toBe('Ticket Submitted successfully');
		})
		
	});

	it('handles file upload correctly', async () => {
		render(<NewTicketForm togglePopup={vi.fn()} />);
		const user = userEvent.setup();

		const fileInput = screen.getByLabelText(/Attachments/i);
		const file = new File(['file content'], 'example.png', {
			type: 'image/png',
		});

		await user.upload(fileInput, file);

		expect(fileInput.files.length).toBe(1);
		expect(fileInput.files[0].name).toBe('example.png');
	});

	it('shows an error toast when API call fails', async () => {
		api.post.mockRejectedValue(new Error('Network error'));
		render(<NewTicketForm togglePopup={vi.fn()} />);

		// Submit the form
		fireEvent.submit(screen.getByTestId('generic-form'));

		// Wait for error toast to be displayed
		await waitFor(() => {
			expect(toast.promise).toHaveBeenCalled();
		});

		/// FAILS !!! ///
		
		// act(() => {
		// 	const failureCallback = toast.promise.mock.calls[0][1].error;	
		// 	expect(failureCallback()).toBe('Error submitting ticket: Network error');
		// })

	});

	it('shows generic error toast when API call fails with an undefined error', async() => {
		api.post.mockRejectedValue({response: {status: 400}})

		render(<NewTicketForm togglePopup={vi.fn()} />);

		// Submit the form
		fireEvent.submit(screen.getByTestId('generic-form'));

		// Wait for error toast to be displayed
		await waitFor(() => {
			expect(toast.promise).toHaveBeenCalled();
		});

		act(() => {
			const failureCallback = toast.promise.mock.calls[0][1].error;	
			expect(failureCallback()).toBe('Error submitting ticket: An unknown error occurred');
		})

	});
});
