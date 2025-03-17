import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	cleanup,
} from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';
import api from '../../api';
import '@testing-library/jest-dom/vitest';

vi.mock('../../api', () => ({
	__esModule: true,
	default: {
		post: vi.fn(),
	},
}));

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		__esModule: true,
		...actual,
		useNavigate: () => navigateMock,
	};
});

afterEach(() => {
	cleanup();
	vi.clearAllMocks(); // Clear all mocks after each test
});

describe('RegisterForm', () => {
	beforeEach(() => {
		vi.spyOn(window, 'alert').mockImplementation(() => {});
		render(
			<MemoryRouter>
				<RegisterForm />
			</MemoryRouter>
		);
	});

	it('renders the form correctly', () => {
		expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Register/i })
		).toBeInTheDocument();
	});

	it('shows loading state when form is submitted', async () => {
		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: 'johndoe' },
		});
		fireEvent.change(screen.getByLabelText(/First Name/i), {
			target: { value: 'John' },
		});
		fireEvent.change(screen.getByLabelText(/Last Name/i), {
			target: { value: 'Doe' },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: 'johndoe@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'password' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

		expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
	});

	it('shows an error message when registration fails', async () => {
		api.post.mockRejectedValue(
			new Error('Username or email is already registered. Please try again.')
		);
		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: 'johndoe' },
		});
		fireEvent.change(screen.getByLabelText(/First Name/i), {
			target: { value: 'John' },
		});
		fireEvent.change(screen.getByLabelText(/Last Name/i), {
			target: { value: 'Doe' },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: 'johndoe@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'password' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith(
				'Username or email is already registered. Please try again.'
			);
		});
	});

	it('redirects to home on successful registration', async () => {
		const mockResponse = {
			status: 201,
		};
		api.post.mockResolvedValue(mockResponse);
		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: '@test' },
		});
		fireEvent.change(screen.getByLabelText(/First Name/i), {
			target: { value: 'first' },
		});
		fireEvent.change(screen.getByLabelText(/Last Name/i), {
			target: { value: 'last' },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: 'first.last@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'password' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith(
				'Registration successful. Please login to continue.'
			);
			expect(navigateMock).toHaveBeenCalledWith('/');
		});
	});
});
