import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/landing/Navbar';

// Mock the logo asset
vi.mock('../../../assets/logo-black.png', () => ({ default: 'mock-logo.png' }));

describe('Navbar Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<Navbar />
			</MemoryRouter>
		);
	};

	it('renders the logo image', () => {
		renderWithRouter();
		const logo = screen.getByAltText('Logo');
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveAttribute('src', 'mock-logo.png');
	});

	it('renders the brand name', () => {
		renderWithRouter();
		expect(screen.getByText(/Apollonian Devs/i)).toBeInTheDocument();
	});

	it('renders the Log In button with correct link', () => {
		renderWithRouter();
		const loginButton = screen.getByRole('link', { name: /Log In/i });
		expect(loginButton).toBeInTheDocument();
		expect(loginButton).toHaveAttribute('href', '/login');
	});

	it('renders the Create an Account button with correct link', () => {
		renderWithRouter();
		const registerButton = screen.getByRole('link', {
			name: /Create an account/i,
		});
		expect(registerButton).toBeInTheDocument();
		expect(registerButton).toHaveAttribute('href', '/register');
	});
});
