import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

describe('Layout Component', () => {
	const renderWithRouter = (initialPath) => {
		render(
			<MemoryRouter initialEntries={[initialPath]}>
				<Layout>
					<div data-testid="child-content">Child Component</div>
				</Layout>
			</MemoryRouter>
		);
	};

	it('renders children components', () => {
		renderWithRouter('/');
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('applies home page background style on /', () => {
		renderWithRouter('/');
		expect(screen.getByTestId('layout-container')).toHaveStyle(
			'background: #ecbc76'
		);
	});

	it('applies default body style on other pages', () => {
		renderWithRouter('/dashboard');
		expect(screen.getByTestId('layout-container')).toHaveStyle(
			'background: linear-gradient(to right, #ecbc76 50%, #fffef9 50%)'
		);
	});
});
