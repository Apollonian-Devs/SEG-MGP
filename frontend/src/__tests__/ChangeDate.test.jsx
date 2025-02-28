import ChangeDate from "../components/ChangeDate";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import api from "../api";
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";

describe(ChangeDate, () => {

    beforeEach(() => {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue("mockAccessToken");
      });
      

    vi.mock("../api", () => ({
        default: {
            post: vi.fn(),
        }
    }));

    it("Change Date form should be correctly rendered with the change date input field", () => {
        render(<MemoryRouter><ChangeDate /></MemoryRouter>);
        expect(screen.getByLabelText(/change date/i)).toBeInTheDocument();
    });


    it("Change date form should be successfully submitted with a valid date", async () => {
        api.post.mockResolvedValue({ status: 201 ,
            data: { ticket: { id: 1, due_date: "2025-12-31" } }
        });

        const user = userEvent.setup();
        
        const mockTicket = {id: 1, due_date: '2025-12-31'}
        const mockSetSelectedTicket = vi.fn();
        const mockSetTickets = vi.fn();

        render(<MemoryRouter>
            <ChangeDate 
            ticket={mockTicket} 
            setSelectedTicket={mockSetSelectedTicket}
            setTickets={mockSetTickets}
            /></MemoryRouter>);

        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, {target:{ value: '2025-12-25'}});

        await user.click(screen.getByRole('button', {name: /confirm change/i}));

        expect(api.post).toHaveBeenCalledTimes(1);

        expect(api.post).toHaveBeenCalledWith("api/tickets/change-date", {
            "id": 1,
            "due_date": "2025-12-25",
        },
        {
            "headers": {
                Authorization: "Bearer mockAccessToken",
            }
            
        });

        // With help from chatGPT

        expect(mockSetTickets).toHaveBeenCalledWith(expect.any(Function));

        // Now we test the behavior inside the function.
        const updateFunction = mockSetTickets.mock.calls[0][0];
        const updatedTickets = updateFunction([{ id: 1, due_date: "2025-12-31" }]); // initial tickets list

        // Check that the ticket in the list has been updated
        expect(updatedTickets).toEqual([{ id: 1, due_date: "2025-12-31" }]);
    })

    it("Console error and correct alert should be displayed when there is a 400 response to an invalid post request", async () => {
        const user = userEvent.setup();
        
        const mockTicketId = {id: 1}

        api.post.mockRejectedValue({response: {status: 400}});

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

        api.post.mockClear();

        render(<MemoryRouter><ChangeDate ticket={mockTicketId}/></MemoryRouter>);

        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, { target: { value: '2024-12-31' } });

        await user.click(screen.getByRole('button', {name: /confirm change/i}));

        expect(alert).toHaveBeenCalledWith("Please ensure you pick a valid date that isn't in the past and isn't today's date");

        expect(consoleError).toHaveBeenCalledWith("The reason for the error is: ", {response: {status: 400}});
    })

    it("Console error and correct alert should be displayed when there is any other response to an invalid post request that isn't 400", async () => {
        const user = userEvent.setup();
        
        const mockTicketId = {id: 1}

        api.post.mockRejectedValue(new Error('Submission failed'));

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

        api.post.mockClear();

        render(<MemoryRouter><ChangeDate ticket={mockTicketId}/></MemoryRouter>);

        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, { target: { value: '2024-12-31' } });

        await user.click(screen.getByRole('button', {name: /confirm change/i}));

        expect(alert).toHaveBeenCalledWith("There has been an error trying to update the due date of the ticket");

        expect(consoleError).toHaveBeenCalledWith("The reason for the error is: ", expect.any(Error));
    })

})