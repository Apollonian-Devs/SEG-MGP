import { render, screen, fireEvent } from '@testing-library/react';
import GenericForm from '../components/GenericForm';

describe('GenericForm Component', () => {
  it('renders with default button label', () => {
    render(<GenericForm>Test Form</GenericForm>);

    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders with custom button label', () => {
    render(<GenericForm buttonLabel='Send Data'>Test Form</GenericForm>);
    
    expect(screen.getByText('Send Data')).toBeInTheDocument();
  });

  it('renders children components', () => {
    const children = [<p>Component One</p>, <h1>Component Two</h1>];
    render (<GenericForm> {children} </GenericForm>);

    expect(screen.getByText('Component One')).toBeInTheDocument();
    expect(screen.getByText('Component Two')).toBeInTheDocument();
  });

  it ('calls function when submit buttom pressed', () => {
    const mockOnSubmit = vi.fn();

    render (<GenericForm onSubmit={mockOnSubmit}> Test Form </GenericForm>);

    const form = screen.getByTestId('generic-form');

    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

  });

  it('should default to method="POST"', () => {
    render(<GenericForm> Test Form </GenericForm>);

    const form = screen.getByTestId('generic-form')

    expect(form).toHaveAttribute('method', 'post');
  });

  it('should apply custom method prop correctly', () => {
    render(<GenericForm method='get'> Test Form </GenericForm>);

    const form = screen.getByTestId('generic-form');

    expect(form).toHaveAttribute('method', 'get');
  });

})
