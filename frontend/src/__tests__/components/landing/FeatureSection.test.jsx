import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FeatureSection from '../../../components/landing/FeatureSection';

describe('FeatureSection Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<FeatureSection />
			</MemoryRouter>
		);
	};

	it('renders the Features heading', () => {
		renderWithRouter();
		expect(screen.getByText(/Features/i)).toBeInTheDocument();
	});

	it('renders the main title', () => {
		renderWithRouter();
		expect(
			screen.getByText(/Simplify Student Support with/i)
		).toBeInTheDocument();
	});

	it('renders all feature items', () => {
		renderWithRouter();
		const featureItems = screen.getAllByRole('heading', { level: 5 }); // Selects all feature titles
		expect(featureItems.length).toBe(6); // Check if all 6 features are displayed
	});

	it('renders correct feature names and descriptions', () => {
		renderWithRouter();

		// Check for each feature title and description
		expect(
			screen.getByRole('heading', { name: /Ticket Submission/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Easily submit your support tickets/i)
		).toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: /Ticket Tracking/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Track the status of your tickets/i)
		).toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: /Knowledge Base/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Access a comprehensive knowledge base/i)
		).toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: /Search Functionality/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Quickly search for existing tickets/i)
		).toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: /Department Routing/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Tickets are automatically routed/i)
		).toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: /Help Desk Integration/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Seamlessly integrate with the university’s help desk/i)
		).toBeInTheDocument();
	});
});
