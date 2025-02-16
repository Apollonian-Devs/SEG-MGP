import { MemoryRouter } from 'react-router-dom';
import NewTicketButton from '../components/NewTicketButton';
import { render, fireEvent, screen } from "@testing-library/react";

describe(NewTicketButton, () => {
    
    it("Clicking the new button should open a popup containing the new ticket form", () => {
        const { getByRole } = render(<MemoryRouter><NewTicketButton /></MemoryRouter>);
        const newButton = getByRole("button", {name: "New"});
        fireEvent.click(newButton);
        const popUp = screen.getByText("Send Query");
        expect(popUp).toBeInTheDocument();
    });

    
});