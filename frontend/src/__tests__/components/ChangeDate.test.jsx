import ChangeDate from "../../components/ChangeDate";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import api from "../../api";
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";
import { toast } from 'sonner';

describe("ChangeDate Component", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        api.post.mockReset();
    
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue("mockAccessToken");
    });
    

    
    vi.mock("../../api", () => ({
        default: {
            post: vi.fn(),
        }
    }));

    vi.mock('sonner', () => ({
        toast: {
            error: vi.fn(),
            success: vi.fn()
        },
    }));

    it("Change Date form should be correctly rendered with the change date input field", () => {
        render(<MemoryRouter><ChangeDate /></MemoryRouter>);
        expect(screen.getByLabelText(/change date/i)).toBeInTheDocument();
    });

    

    it("Change date form should be successfully submitted with a valid date and correct toast should be displayed", async () => {
        api.post.mockResolvedValue({ status: 201 ,
            data: { ticket: { id: 1, due_date: "2025-12-25" } }
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

        expect(toast.success).toHaveBeenCalledWith("The due date for the ticket has been successfully updated");

        expect(mockSetSelectedTicket).toHaveBeenCalledWith(expect.any(Function)); 

        const getSetSelectedTicketCall = mockSetSelectedTicket.mock.calls[0][0]; 
        const updatedTicket = getSetSelectedTicketCall({ id: 1, due_date: "2025-12-31" }); 

        expect(updatedTicket).toEqual({
            id: 1,
            due_date: "2025-12-25",
        });

        expect(mockSetTickets).toHaveBeenCalledWith(expect.any(Function));

        const getSetTicketsCall = mockSetTickets.mock.calls[0][0];
        const updatedTickets = getSetTicketsCall([{ id: 1, due_date: "2025-12-31" }, {id: 2, due_date: "2025-12-30"}]); // initial tickets list

        expect(updatedTickets).toEqual([{ id: 1, due_date: "2025-12-25" }, {id: 2, due_date: "2025-12-30"}]);
    })

    it("Correct toast should be displayed when there is a 400 response to an invalid post request", async () => {
        const user = userEvent.setup();
        
        const mockTicketId = {id: 1}

        api.post.mockRejectedValue({response: {status: 400}});

        api.post.mockClear();

        render(<MemoryRouter><ChangeDate ticket={mockTicketId}/></MemoryRouter>);

        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, { target: { value: '2024-12-31' } });

        await user.click(screen.getByRole('button', {name: /confirm change/i}));

        expect(toast.error).toHaveBeenCalledWith("❌ Please ensure you pick a valid date that isn't in the past and isn't today's date");
    })

    it("Correct toast should be displayed when there is any other response to an invalid post request that isn't 400", async () => {
        const user = userEvent.setup();
        
        const mockTicketId = {id: 1}

        api.post.mockRejectedValue(new Error('Submission failed'));

        api.post.mockClear();

        render(<MemoryRouter><ChangeDate ticket={mockTicketId}/></MemoryRouter>);

        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, { target: { value: '2024-12-31' } });

        await user.click(screen.getByRole('button', {name: /confirm change/i}));

        expect(toast.error).toHaveBeenCalledWith("❌ There has been an error trying to update the due date of the ticket");

    })

    it("Date doesn't get updated when there is a non-error response that is not 201", async () => {
        const user = userEvent.setup();
        
        const mockTicket = { id: 1, due_date: "2025-12-31" };
        const mockSetSelectedTicket = vi.fn();
        const mockSetTickets = vi.fn();
    
        api.post.mockResolvedValue({ status: 200 }); // Correctly mock response
    
        render(
            <MemoryRouter>
                <ChangeDate 
                    ticket={mockTicket} 
                    setSelectedTicket={mockSetSelectedTicket}
                    setTickets={mockSetTickets}
                />
            </MemoryRouter>
        );
    
        const date = screen.getByPlaceholderText(/enter the new date/i);
        fireEvent.change(date, { target: { value: "2025-12-31" } });
    
        await user.click(screen.getByRole("button", { name: /confirm change/i }));
    
        expect(api.post).toHaveBeenCalledTimes(1); // Ensure only 1 API call
    
        // Ensure toast.success was never called
        expect(toast.success).not.toHaveBeenCalled();
        
        // Ensure state updates never happened
        expect(mockSetSelectedTicket).not.toHaveBeenCalled();
        expect(mockSetTickets).not.toHaveBeenCalled();
    });
    
    

})