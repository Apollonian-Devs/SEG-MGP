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
import LoginForm from '../components/LoginForm';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '@testing-library/jest-dom/vitest';

vi.mock('../api', () => ({
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
});

describe('LoginForm', () => {
	beforeEach(() => {
		vi.spyOn(Storage.prototype, 'setItem');
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
	});

	it('renders the form correctly', () => {
		expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Sign in/i })
		).toBeInTheDocument();
	});


	it('shows an error message when login fails', async () => {
		api.post.mockRejectedValue({
			response: { data: { message: 'Invalid credentials' } },
		});

		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: 'wronguser' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'wrongpassword' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

		await waitFor(() =>
			expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
		);
	});

	it ('shows default error message when login response message fails', async () => {
		api.post.mockRejectedValue({ response: { data: {} } });

		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: 'wronguser' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'wrongpassword' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

		await waitFor(() =>
			expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument()
		)
	});

	it('redirects to dashboard on successful login', async () => {
		const mockResponse = {
			data: { access: 'access_token', refresh: 'refresh_token' },
			status: 200,
		};
		api.post.mockResolvedValue(mockResponse);

		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: '@johndoe' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: '1234' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				ACCESS_TOKEN,
				'access_token'
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				REFRESH_TOKEN,
				'refresh_token'
			);
			expect(navigateMock).toHaveBeenCalledWith('/dashboard');
		});
	});
});
