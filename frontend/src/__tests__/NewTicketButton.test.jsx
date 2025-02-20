import { MemoryRouter } from 'react-router-dom';
import NewTicketButton from '../components/NewTicketButton';
import { render, fireEvent, screen } from "@testing-library/react";

describe(NewTicketButton, () => {
    
    it("New ticket button should be correctly rendered", () => {
        render(<NewTicketButton />);
        const newButton = screen.getByRole("button", {name: /new/i});
        expect(newButton).toBeInTheDocument();
    })
    
    it("Clicking the new button should open a popup containing the new ticket form", () => {
        render(<MemoryRouter><NewTicketButton /></MemoryRouter>);
        const newButton = screen.getByRole("button", {name: /new/i});
        
        // pop up not open at first
        expect(screen.queryByText(/send query/i)).not.toBeInTheDocument(); 
        
        fireEvent.click(newButton);
        const popUp = screen.getByText(/send query/i); // pop up which contains the NewTicketForm component
        expect(popUp).toBeInTheDocument();
    });

    it("Clicking the close button in the popup should close it", () => {
        render(<MemoryRouter><NewTicketButton /></MemoryRouter>);
        const newButton = screen.getByRole("button", {name: /new/i});
        fireEvent.click(newButton);

        const closeButton = screen.getByRole("button", {name: '✕'} );
        fireEvent.click(closeButton);
        expect(screen.queryByText(/send query/i)).not.toBeInTheDocument();
    }); 
    
});