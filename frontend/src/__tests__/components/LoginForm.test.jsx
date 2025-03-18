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
import LoginForm from '../../components/LoginForm';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import '@testing-library/jest-dom/vitest';
import { toast } from 'sonner';

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

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn()
	},
}));

afterEach(() => {
	localStorage.clear()
	navigateMock.mockClear();
});

describe('LoginForm', () => {
	beforeEach(() => {
		vi.spyOn(Storage.prototype, 'setItem');
	});

	it('renders the form correctly', () => {
		render(<MemoryRouter><LoginForm /></MemoryRouter>);
		
		expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Sign in/i })
		).toBeInTheDocument();
	});


	it ('shows error message when login fails', async () => {
		render(<MemoryRouter><LoginForm /></MemoryRouter>);
		
		api.post.mockRejectedValue({ status: 400 });

		fireEvent.change(screen.getByLabelText(/Username/i), {
			target: { value: 'wronguser' },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: 'wrongpassword' },
		});
		fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("❌ Login failed. Please try again.")
		)
	});

	it('redirects to dashboard on successful login', async () => {
		render(<MemoryRouter><LoginForm /></MemoryRouter>);
		
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

	it('redirects to dashboard automatically if the user is already logged in', async () => {		
		localStorage.setItem(ACCESS_TOKEN, 'access_token')
		
		render(<MemoryRouter><LoginForm /></MemoryRouter>);
		
		expect(navigateMock).toHaveBeenCalledWith('/dashboard');
		
	});

});
