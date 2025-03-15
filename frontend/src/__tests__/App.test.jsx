import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import App from '../App';

// Mock IntersectionObserver for components that require it
beforeAll(() => {
	global.IntersectionObserver = vi.fn(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));
});

describe('App Component Pathname Routing', () => {
	const renderWithRouter = (initialPath) => {
		let location;
		const TestComponent = () => {
			location = useLocation();
			return null;
		};
		render(
			<MemoryRouter initialEntries={[initialPath]}>
				<App />
				<TestComponent />
			</MemoryRouter>
		);
		return location;
	};

	it('renders Home page on /', () => {
		const location = renderWithRouter('/');
		expect(location.pathname).toBe('/');
		expect(screen.getByText('Student Support Hub:')).toBeInTheDocument();
	});

	it('redirects to /login when accessing /dashboard without a session', () => {
		const location = renderWithRouter('/dashboard');
		expect(location.pathname).toBe('/login');
		expect(
			screen.getByRole('heading', { name: /Sign In/i })
		).toBeInTheDocument();
	});

	it('renders Login page on /login', () => {
		const location = renderWithRouter('/login');
		expect(location.pathname).toBe('/login');
		expect(
			screen.getByRole('heading', { name: /Sign In/i })
		).toBeInTheDocument();
	});

	it('renders Register page on /register', () => {
		const location = renderWithRouter('/register');
		expect(location.pathname).toBe('/register');
		expect(
			screen.getByRole('heading', { name: /Register/i })
		).toBeInTheDocument();
	});

	it('renders HelpQA page on /helpfaq', () => {
		const location = renderWithRouter('/helpfaq');
		expect(location.pathname).toBe('/helpfaq');
		expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
	});

	it('renders NotFound page on unknown paths', () => {
		const location = renderWithRouter('/random-path');
		expect(location.pathname).toBe('/random-path');
		expect(screen.getByText('404')).toBeInTheDocument();
	});

	it('redirects to Home when logging out', () => {
		const location = renderWithRouter('/logout');
		expect(location.pathname).toBe('/');
		expect(screen.getByText('Student Support Hub:')).toBeInTheDocument();
	});
});
