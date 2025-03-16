import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

describe('NotFound Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<NotFound />
			</MemoryRouter>
		);
	};

	it('renders the 404 heading', () => {
		renderWithRouter();
		expect(screen.getByText(/404/i)).toBeInTheDocument();
	});

	it('renders the Page Not Found message', () => {
		renderWithRouter();
		expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
	});

	it('renders the description text', () => {
		renderWithRouter();
		expect(
			screen.getByText(/The page you're looking for doesn't exist/i)
		).toBeInTheDocument();
	});

	it('renders the Go Home link', () => {
		renderWithRouter();
		const homeLink = screen.getByRole('link', { name: /Go Home/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute('href', '/');
	});
});
