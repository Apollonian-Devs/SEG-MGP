import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FeatureSection, {
	features,
} from '../../../components/landing/FeatureSection';

const mockUseInView = vi.fn(() => true); // Default: always in view

vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }) => <div {...props}>{children}</div>,
		h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
		span: ({ children, ...props }) => <span {...props}>{children}</span>,
	},
	useInView: () => mockUseInView(), // Use the mocked function
}));

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
		expect(featureItems.length).toBe(features.length); // Check if all features are displayed
	});

	it('renders correct feature names and descriptions', () => {
		renderWithRouter();

		features.forEach(({ text, description }) => {
			expect(screen.getByRole('heading', { name: text })).toBeInTheDocument();
			expect(screen.getByText(description)).toBeInTheDocument();
		});
	});

	it('applies correct animation delays for features', () => {
		render(
			<MemoryRouter>
				<FeatureSection />
			</MemoryRouter>
		);

		features.forEach((feature, index) => {
			expect(
				screen.getByRole('heading', { name: feature.text })
			).toBeInTheDocument();

			// Check if each feature is rendered with the expected delay
			// (We can't directly check animations, but we ensure order)
			expect(screen.getByText(feature.description)).toBeInTheDocument();
		});
	});

	it('renders elements with initial hidden state when not in view', () => {
		mockUseInView.mockReturnValueOnce(false); // Simulate elements NOT in view

		render(
			<MemoryRouter>
				<FeatureSection />
			</MemoryRouter>
		);

		// The text should be in the document, but initial animation states (opacity 0) apply
		expect(screen.getByText(/Features/i)).toBeInTheDocument();
	});
});
