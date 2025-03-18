import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';

// Mocking LoginForm since we are only testing if Login renders it
vi.mock('../../components/LoginForm', () => ({
	__esModule: true,
	default: () => <form data-testid="login-form">Login Form</form>,
}));

// Mocking the logo image
vi.mock('../../assets/logo.png', () => ({ default: 'mock-logo.png' }));

describe('Login Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		);
	};

	it('renders the company logo', () => {
		renderWithRouter();
		const logo = screen.getByAltText('Logo');
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveAttribute('src', 'mock-logo.png');
	});

	it('renders the brand name Apollonian Devs', () => {
		renderWithRouter();
		expect(screen.getByText(/Apollonian Devs/i)).toBeInTheDocument();
	});

	it('renders the LoginForm component', () => {
		renderWithRouter();
		expect(screen.getByTestId('login-form')).toBeInTheDocument();
	});

	it('renders the No Account? text', () => {
		renderWithRouter();
		expect(screen.getByText(/No Account\?/i)).toBeInTheDocument();
	});

	it('renders a Register link', () => {
		renderWithRouter();
		const registerLink = screen.getByRole('link', { name: /Register/i });
		expect(registerLink).toBeInTheDocument();
		expect(registerLink).toHaveAttribute('href', '/register');
	});
});
