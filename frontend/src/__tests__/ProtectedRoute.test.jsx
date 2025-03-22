import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
	},
}));

// Mock API and JWT Decode
vi.mock('../api', () => ({
	__esModule: true,
	default: {
		post: vi.fn(),
	},
}));

vi.mock('jwt-decode', () => ({
	jwtDecode: vi.fn(),
}));

// Mock LocalStorage
beforeEach(() => {
	vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
		if (key === ACCESS_TOKEN) return 'valid-access-token';
		if (key === REFRESH_TOKEN) return 'valid-refresh-token';
		return null;
	});
	vi.spyOn(Storage.prototype, 'setItem');
	vi.spyOn(Storage.prototype, 'clear');
});

// Test wrapper component to use useLocation()
const LocationTestWrapper = () => {
	const location = useLocation();
	return <div data-testid="location-path">{location.pathname}</div>;
};

describe('ProtectedRoute Component', () => {
	const renderWithRouter = (isTokenValid, refreshTokenResponse) => {
		jwtDecode.mockImplementation(() => ({
			exp: isTokenValid ? Date.now() / 1000 + 3600 : Date.now() / 1000 - 3600, // Expired token
		}));

		if (!isTokenValid) {
			api.post.mockResolvedValue(refreshTokenResponse);
		}

		render(
			<MemoryRouter initialEntries={['/protected']}>
				<ProtectedRoute>
					<div data-testid="protected-content">Protected Content</div>
				</ProtectedRoute>
				<LocationTestWrapper />
			</MemoryRouter>
		);
	};

	it('renders protected content when the token is valid', async () => {
		renderWithRouter(true);
		await waitFor(() =>
			expect(screen.getByTestId(/protected-content/i)).toBeInTheDocument()
		);
	});

	it('refreshes token if expired and grants access', async () => {
		renderWithRouter(false, {
			status: 200,
			data: { access: 'new-access-token' },
		});

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				ACCESS_TOKEN,
				'new-access-token'
			);
			expect(screen.getByTestId('protected-content')).toBeInTheDocument();
		});
	});

	it('redirects to login if refresh token fails', async () => {
		renderWithRouter(false, { status: 401 });

		await waitFor(() => {
			expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
			expect(screen.getByTestId('location-path')).toHaveTextContent('/login');
		});
	});

	it('redirects to login if there is no access token', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
		renderWithRouter(false);

		await waitFor(() => {
			expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
			expect(screen.getByTestId('location-path')).toHaveTextContent('/login');
		});
	});
});

describe('ProtectedRoute - Token Refresh Failure', () => {
	beforeEach(() => {
		// Expired token (forces refreshToken() to be called)
		jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 10 });
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('calls toast.error when token refresh fails', async () => {
		api.post.mockRejectedValueOnce(new Error('Token refresh failed'));

		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith('/api/token/refresh/', {
				refresh: 'valid-refresh-token',
			});
			expect(toast.error).toHaveBeenCalledWith('Error refreshing token', {
				description: 'Token refresh failed',
			});
			expect(localStorage.clear).toHaveBeenCalled();
		});

		// Ensure Protected Content is NOT shown
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
	});
});
