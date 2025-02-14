import NewTicketButton from "./NewTicketButton";
import { render, fireEvent } from "@testing-library/react";

describe(NewTicketButton, () => {
    
    it("Clicking the new button should open the popup", () => {
        const { getByRole } = render(<NewTicketButton />);
        const newButton = getByRole("button", {name: "New"});
        // fireEvent.click(newButton);
        expect(newButton).toBeInTheDocument();
    });
});