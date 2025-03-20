import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../../pages/Home';

// Mocking child components since we are only testing if Home renders them
vi.mock('../../components/landing/Navbar', () => ({
	__esModule: true,
	default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('../../components/landing/HeroSection', () => ({
	__esModule: true,
	default: () => <section data-testid="hero-section">HeroSection</section>,
}));

vi.mock('../../components/landing/FeatureSection', () => ({
	__esModule: true,
	default: () => (
		<section data-testid="feature-section">FeatureSection</section>
	),
}));

vi.mock('../../components/landing/Workflow', () => ({
	__esModule: true,
	default: () => <section data-testid="workflow-section">Workflow</section>,
}));

describe('Home Component', () => {
	it('renders Navbar', () => {
		render(<Home />);
		expect(screen.getByTestId('navbar')).toBeInTheDocument();
	});

	it('renders HeroSection', () => {
		render(<Home />);
		expect(screen.getByTestId('hero-section')).toBeInTheDocument();
	});

	it('renders FeatureSection', () => {
		render(<Home />);
		expect(screen.getByTestId('feature-section')).toBeInTheDocument();
	});

	it('renders Workflow section', () => {
		render(<Home />);
		expect(screen.getByTestId('workflow-section')).toBeInTheDocument();
	});

	it('renders Footer with correct text', () => {
		render(<Home />);
		expect(
			screen.getByText(/Software Engineering Group Project/i)
		).toBeInTheDocument();
	});
});
