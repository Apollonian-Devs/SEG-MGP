import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../pages/Register';

// Mock RegisterForm component to avoid testing its internal logic
vi.mock('../../components/RegisterForm', () => ({
	__esModule: true,
	default: () => <form data-testid="register-form">Register Form</form>,
}));

describe('Register Component', () => {
	const renderWithRouter = () => {
		render(
			<MemoryRouter>
				<Register />
			</MemoryRouter>
		);
	};

	it('renders the Register component', () => {
		renderWithRouter();
		expect(screen.getByTestId('register-component')).toBeInTheDocument();
	});

	it('renders the RegisterForm component', () => {
		renderWithRouter();
		expect(screen.getByTestId('register-form')).toBeInTheDocument();
	});
});
