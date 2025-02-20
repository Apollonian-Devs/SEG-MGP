import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import jwtDecode from 'jwt-decode';
import '@testing-library/jest-dom/vitest';

// Mock the api module
vi.mock('../api', () => ({
	__esModule: true,
	default: {
		post: vi.fn(),
	},
}));

// Mock the jwt-decode module
vi.mock('jwt-decode', () => ({
	__esModule: true,
	default: vi.fn(),
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
	vi.clearAllMocks(); // Clear all mocks after each test
});

describe('ProtectedRoute', () => {
	beforeEach(() => {
		vi.spyOn(Storage.prototype, 'setItem');
		cleanup();
		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		);
	});

	it('redirects to home if not authorized', async () => {
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
	});

	// it('shows protected content if authorized', async () => {
	// 	localStorage.setItem(ACCESS_TOKEN, 'valid_token');
	// 	jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 5000 });

	// 	await waitFor(() =>
	// 		expect(screen.getByText(/Protected Content/i)).toBeInTheDocument()
	// 	);
	// });
});
