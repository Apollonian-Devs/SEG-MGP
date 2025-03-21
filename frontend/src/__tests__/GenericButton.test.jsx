import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GenericButton from '../components/GenericButton';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('GenericButton Component', () => {
  it('renders with correct text', () => {
    render(<GenericButton>Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('uses default props when none are provided', () => {
    render(<GenericButton>Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toHaveAttribute('type', 'button'); // Default type check
  });

  it('renders with correct class', () => {
    render(<GenericButton className="btn">Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toHaveClass('btn');
  });

  it('renders with correct type', () => {
    render(<GenericButton type="submit">Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toHaveAttribute('type', 'submit');
  });

  it('renders with correct style', () => {
    render(<GenericButton style={{ color: 'red' }}>Click Me</GenericButton>);
    expect(screen.getByText('Click Me')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<GenericButton onClick={onClick}>Click Me</GenericButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders multiple children correctly', () => {
    render(
      <GenericButton>
        <span>Click</span> <strong>Me</strong>
      </GenericButton>
    );
    expect(screen.getByText('Click')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('creates a ripple effect when clicked', async () => {
    render(<GenericButton>Click Me</GenericButton>);

    fireEvent.click(screen.getByText('Click Me'));

    await waitFor(() => {
      expect(screen.getByTestId('generic-button').querySelector('.ripple')).toBeInTheDocument();
    });
  });
});
