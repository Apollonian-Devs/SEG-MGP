import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from '../../../components/landing/HeroSection';

// Mock assets
vi.mock('../../../assets/feel-me-think-about-it.gif', () => ({
	default: 'mock-gif1.gif',
}));
vi.mock('../../../assets/coding.gif', () => ({ default: 'mock-gif2.gif' }));

describe('HeroSection Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<HeroSection />
			</MemoryRouter>
		);
	};

	it('renders the main heading', () => {
		renderWithRouter();
		expect(screen.getByText(/Student Support Hub:/i)).toBeInTheDocument();
	});

	it('renders the Apollonian Devs text with gradient effect', () => {
		renderWithRouter();
		expect(screen.getByText(/Apollonian Devs/i)).toBeInTheDocument();
	});

	it('renders the description text', () => {
		renderWithRouter();
		expect(
			screen.getByText(/Streamline your support requests/i)
		).toBeInTheDocument();
	});

	it('renders the Submit a Ticket button with correct link', () => {
		renderWithRouter();
		const ticketButton = screen.getByRole('link', { name: /Submit a Ticket/i });
		expect(ticketButton).toBeInTheDocument();
		expect(ticketButton).toHaveAttribute('href', '/dashboard');
	});

	it('renders the Help & FAQs button with correct link', () => {
		renderWithRouter();
		const faqButton = screen.getByRole('link', { name: /Help & FAQs/i });
		expect(faqButton).toBeInTheDocument();
		expect(faqButton).toHaveAttribute('href', '/helpfaq');
	});

	it('renders the GIF1 image', () => {
		renderWithRouter();
		const gifImage = screen.getByAltText('GIF 1');
		expect(gifImage).toBeInTheDocument();
		expect(gifImage).toHaveAttribute('src', 'mock-gif1.gif');
	});

	it('renders the GIF2 image', () => {
		renderWithRouter();
		const gifImage = screen.getByAltText('GIF 2');
		expect(gifImage).toBeInTheDocument();
		expect(gifImage).toHaveAttribute('src', 'mock-gif2.gif');
	});
});
