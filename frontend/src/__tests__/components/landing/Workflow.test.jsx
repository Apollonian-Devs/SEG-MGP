import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Workflow, { checklistItems } from '../../../components/landing/Workflow';

// Mock the image asset
vi.mock('../../../assets/question.png', () => ({
	default: 'mock-question.png',
}));

describe('Workflow Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<Workflow />
			</MemoryRouter>
		);
	};

	it('renders the main heading', () => {
		renderWithRouter();
		expect(
			screen.getByRole('heading', { name: /Streamline your/i })
		).toBeInTheDocument();
	});

	it('renders all checklist items', () => {
		renderWithRouter();
		const featureItems = screen.getAllByRole('heading', { level: 5 }); // Selects all feature titles
		expect(featureItems.length).toBe(checklistItems.length);
	});

	it('renders correct checklist item titles and descriptions', () => {
		renderWithRouter();

		checklistItems.forEach((item) => {
			expect(
				screen.getByRole('heading', { name: item.title })
			).toBeInTheDocument();
			expect(screen.getByText(item.description)).toBeInTheDocument();
		});
	});

	it('renders the ticketing system image', () => {
		renderWithRouter();
		const image = screen.getByAltText('Ticketing System');
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', 'mock-question.png');
	});
});
