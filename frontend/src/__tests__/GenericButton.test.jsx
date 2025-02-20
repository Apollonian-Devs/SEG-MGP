import React from 'react';
import { render, screen } from '@testing-library/react';
import GenericButton from '../components/GenericButton';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('GenericButton Component', () => {
	it('renders with correct text', () => {
		render(<GenericButton>Click Me</GenericButton>);
		expect(screen.getByText('Click Me')).toBeInTheDocument();
	});
});
