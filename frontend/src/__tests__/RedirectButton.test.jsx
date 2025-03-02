import { render, screen, fireEvent } from '@testing-library/react';
import RedirectButton from '../components/RedirectButton';
import api from '../api'; 

describe('RedirectButton Component', () => {
  it('renders the button', () => {
    render(<RedirectButton />);

    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Redirect');
  });

//---------------- assisted with mocking API calls with chatGPT --------------

  it('redirects successfully when redirect button is clicked with correct information', async () => {
    const mockAlert = vi.fn();
    global.alert = mockAlert;

    const mockPost = vi.fn().mockResolvedValue({
      data: { ticket: '123' },
    });
    api.post = mockPost;

    const ticketid = "123";
    const selectedOfficer = { user: { id: '456', username: 'john_doe' }};

    render(<RedirectButton ticketid={ticketid} selectedOfficer={selectedOfficer} />);

    fireEvent.click(screen.getByRole('button'));

    await screen.findByText('Redirect'); 

    expect(mockAlert).toHaveBeenCalledWith(
      'Ticket successfully redirected to officer john_doe'
    );

  });


//---------------------------------------------------------------------------

it('shows an error alert if the API request fails', async () => {
  const mockAlert = vi.fn();
  global.alert = mockAlert;

  const mockPost = vi.fn().mockRejectedValue(new Error('Test Error'));
  api.post = mockPost;

  const ticketid = "123";
  const selectedOfficer = { user: { id: '456', username: 'john_doe' } };

  render(<RedirectButton ticketid={ticketid} selectedOfficer={selectedOfficer} />);

  fireEvent.click(screen.getByRole('button'));

  await screen.findByText('Redirect'); 

  expect(mockAlert).toHaveBeenCalledWith(
    'Failed to redirect ticket. Please try again.'
  );

});

it('alerts when no officer is selected', async () => {
  const mockAlert = vi.fn();
  global.alert = mockAlert;

  const mockPost = vi.fn().mockResolvedValue({
    data: { ticket: '123' },
  });
  api.post = mockPost;

  const ticketid = "123";

  render(<RedirectButton ticketid={ticketid} selectedOfficer={null} />);

  fireEvent.click(screen.getByRole('button'));

  await screen.findByText('Redirect'); 

  expect(mockAlert).toHaveBeenCalledWith(
    "Please select either an officer or a department to redirect the ticket."
  );

});

});