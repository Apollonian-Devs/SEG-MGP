import NewTicketForm from '../components/NewTicketForm';
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, vi } from 'vitest';
import api from "../api";

describe(NewTicketForm, () => {
    
    vi.mock("../api", () => ({
        default: {
            post: vi.fn(),
        }
    }));

    vi.mock(import("react-router-dom"), async (importOriginal) => {
        const actual = await importOriginal()
        return {
          ...actual,
          useNavigate: vi.fn(),
        }
      });
    
    it("New ticket form should be correctly rendered", () => {
        render(<MemoryRouter><NewTicketForm /></MemoryRouter>);
        const form = screen.getByText(/send query/i);
        expect(form).toBeInTheDocument();
    });

    it("New ticket form should be successfully submitted the user navigated to the dashboard after submission", async () => {
        
        api.post.mockResolvedValue({ status: 201 });
        
        const user = userEvent.setup();

        const navigate = vi.fn();
        useNavigate.mockReturnValue(navigate);

        // Form input and submission
        render(<MemoryRouter><NewTicketForm /></MemoryRouter>)

        const subject = screen.getByPlaceholderText(/enter the subject of your query/i);
        await user.type(subject, 'Dorm issue');
        
        const description = screen.getByPlaceholderText(/enter the description of your query/i);
        await user.type(description, 'I have no hot water in my dorm room');
        
        const message = screen.getByPlaceholderText(/enter your message to the team/i);
        await user.type(message, 'Any updates? It has been 2 days since my hot water went out');
        
        const attachments = screen.getByPlaceholderText(/optionally attach relevant files/i);
        const file = new File(['hello'], 'hello.png', {type: 'image/png'});
        await user.upload(attachments, file);

        await user.click(screen.getByRole('button', {name: /send ticket/i}));

        // Testing submission of form
        expect(api.post).toHaveBeenCalledTimes(1);
        
        expect(api.post).toHaveBeenCalledWith("api/tickets/", {
            "subject": "Dorm issue",
            "description": "I have no hot water in my dorm room",
            "message": "Any updates? It has been 2 days since my hot water went out",
            "attachments": [
                {
                "file_name": "hello.png",
                "file_path": "https://your-storage-service.com/uploads/hello.png",
                "mime_type": "image/png",
                },
            ],
        });
        
        // Testing navigation of form
        expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
    
    it("Correct console error and alert should be displayed when there is some error submitting the form", async () => {
        const user = userEvent.setup();
        
        api.post.mockRejectedValue(new Error('Submission failed'));

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

        api.post.mockClear();

        // Form input and submission
        render(<MemoryRouter><NewTicketForm /></MemoryRouter>)

        const subject = screen.getByPlaceholderText(/enter the subject of your query/i);
        await user.type(subject, 'Dorm issue');
        
        const description = screen.getByPlaceholderText(/enter the description of your query/i);
        await user.type(description, 'I have no hot water in my dorm room');
        
        const message = screen.getByPlaceholderText(/enter your message to the team/i);
        await user.type(message, 'Any updates? It has been 2 days since my hot water went out');

        const attachments = screen.getByPlaceholderText(/optionally attach relevant files/i);
        const file = new File(['hello'], 'hello.png', {type: 'image/png'});
        await user.upload(attachments, file);

        await user.click(screen.getByRole('button', {name: /send ticket/i}));

        expect(consoleError).toHaveBeenCalledWith("Error submitting ticket:", expect.any(Error));
        
        expect(alert).toHaveBeenCalledWith("Sorry, there was an error trying to send this ticket.");
    });

})