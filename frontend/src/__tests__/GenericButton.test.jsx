import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GenericButton from '../components/GenericButton';

describe('GenericButton Component', () => {
  it('renders with correct text', () => {
    render(<GenericButton>Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});