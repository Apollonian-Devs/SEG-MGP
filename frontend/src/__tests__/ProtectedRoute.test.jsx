import React from 'react';
import { cleanup, render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import '@testing-library/jest-dom/vitest';

// Mock the api module
vi.mock('../api', () => ({
	__esModule: true,
	default: { post: vi.fn() },
}));

// Mock the jwt-decode module
vi.mock('jwt-decode', () => ({
	__esModule: true,
	jwtDecode: vi.fn(), // Use named export for consistency
}));

// Mock the Navigate component
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		__esModule: true,
		...actual,
		Navigate: (props) => {
			mockNavigate(props.to);
			return <div>Mock Navigate to {props.to}</div>;
		},
	};
});

afterEach(() => {
	vi.clearAllMocks();
	cleanup();
	localStorage.clear();
});

describe('ProtectedRoute', () => {
	it('redirects to home if not authorized', async () => {
		// No token in localStorage
		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login');
		});
	});

	it('shows protected content if authorized', async () => {
		// Set a valid token before rendering
		localStorage.setItem(ACCESS_TOKEN, 'valid_token');
		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 5000 });

		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		
		await waitFor(() => {
			expect(screen.getByText(/protected content/i)).toBeInTheDocument();
		});
	});

	it('refreshes token if expired', async () => {
		vi.spyOn(Storage.prototype, 'setItem'); // Now setItem is a spy

		// Setup expired token in localStorage
		localStorage.setItem(ACCESS_TOKEN, 'expired_token');
		localStorage.setItem(REFRESH_TOKEN, 'valid_refresh_token');

		// Mock an expired token
		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 5000 });

		// Mock API token refresh
		api.post.mockResolvedValue({
			status: 200,
			data: { access: 'new_access_token' },
		});

		// Render AFTER setting everything up
		await act(async () => {
			render(
				<MemoryRouter>
					<ProtectedRoute>
						<div>Protected Content</div>
					</ProtectedRoute>
				</MemoryRouter>
			);
		});

		// Wait for token to be updated
		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				ACCESS_TOKEN,
				'new_access_token'
			);
		});
	});

	it('faulty referesh token request should result in unauthorized', async () => {
		// Setup expired token in localStorage
		localStorage.setItem(ACCESS_TOKEN, 'expired_token');
		localStorage.setItem(REFRESH_TOKEN, 'valid_refresh_token');

		// Mock an expired token
		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 5000 });

		api.post.mockResolvedValue({
			status: 401,
			data: { access: 'new_access_token' },
		});

		await act(async () => {
			render(
				<MemoryRouter>
					<ProtectedRoute>
						<div>Protected Content</div>
					</ProtectedRoute>
				</MemoryRouter>
			);
		});

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login');
		});
	});

	it('failed post request results in an error', async () => {
		localStorage.setItem(ACCESS_TOKEN, 'expired_token');
		localStorage.setItem(REFRESH_TOKEN, 'valid_refresh_token');

		jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 5000 });

		api.post.mockRejectedValue({
			status: 500,
		});

		await act(async () => {
			render(
				<MemoryRouter>
					<ProtectedRoute>
						<div>Protected Content</div>
					</ProtectedRoute>
				</MemoryRouter>
			);
		});

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login');
		});
	});
});
