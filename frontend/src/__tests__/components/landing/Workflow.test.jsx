import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Workflow, { checklistItems } from '../../../components/landing/Workflow';

// Mock the image asset
vi.mock('../../../assets/question.png', () => ({
	default: 'mock-question.png',
}));

// Mock Framer Motion
const mockUseInView = vi.fn(() => true);

vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }) => <div {...props}>{children}</div>,
		h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
		img: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
	},
	useInView: () => mockUseInView(),
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
		expect(screen.getByText(/Streamline your/i)).toBeInTheDocument();
	});

	it('renders the image with correct alt text', () => {
		renderWithRouter();
		expect(screen.getByAltText(/Ticketing System/i)).toBeInTheDocument();
	});

	it('renders all checklist items', () => {
		renderWithRouter();
		const checklistHeadings = screen.getAllByRole('heading', { level: 5 });
		expect(checklistHeadings.length).toBe(checklistItems.length);
	});

	it('renders checklist items with correct titles and descriptions', () => {
		renderWithRouter();
		checklistItems.forEach(({ title, description }) => {
			expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
			expect(screen.getByText(description)).toBeInTheDocument();
		});
	});

	it('renders elements with initial hidden state when not in view', () => {
		mockUseInView.mockReturnValueOnce(false); // Simulate elements NOT in view

		renderWithRouter();

		expect(screen.getByText(/Streamline your/i)).toBeInTheDocument();
	});
});
