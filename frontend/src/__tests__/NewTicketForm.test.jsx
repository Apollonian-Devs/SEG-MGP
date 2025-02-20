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
    
    it("New ticket form should be correctly rendered with correct input fields", () => {
        render(<NewTicketForm />);
        expect(screen.getByText(/send query/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/attachments/i)).toBeInTheDocument();
    });

    it("New ticket form should be successfully submitted with all valid input and the user should be navigated to the dashboard", async () => {
        api.post.mockResolvedValue({ status: 201 });
        
        const user = userEvent.setup();

        const navigate = vi.fn();
        useNavigate.mockReturnValue(navigate);

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
    
    it("Console error and alert should be displayed when there is some error submitting the form", async () => {
        const user = userEvent.setup();
        
        api.post.mockRejectedValue(new Error('Submission failed'));

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

        api.post.mockClear();

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

    it("Form should not be able to be submitted with a missing required field", async () => {
        const user = userEvent.setup();

        api.post.mockClear();

        render(<MemoryRouter><NewTicketForm /></MemoryRouter>);

        // Missing required subject field
        const subject = screen.getByPlaceholderText(/enter the subject of your query/i);
        
        const description = screen.getByPlaceholderText(/enter the description of your query/i);
        await user.type(description, 'I have no hot water in my dorm room');
        
        const message = screen.getByPlaceholderText(/enter your message to the team/i);
        await user.type(message, 'Any updates? It has been 2 days since my hot water went out');

        const attachments = screen.getByPlaceholderText(/optionally attach relevant files/i);
        const file = new File(['hello'], 'hello.png', {type: 'image/png'});
        await user.upload(attachments, file);

        await user.click(screen.getByRole('button', {name: /send ticket/i}));

        expect(api.post).toHaveBeenCalledTimes(0);
    });

    it("Form should be able to be submitted with a missing non-required field", async () => {
        api.post.mockResolvedValue({ status: 201 });
        
        const user = userEvent.setup();

        const navigate = vi.fn();
        useNavigate.mockReturnValue(navigate);

        api.post.mockClear();

        render(<MemoryRouter><NewTicketForm /></MemoryRouter>);

        const subject = screen.getByPlaceholderText(/enter the subject of your query/i);
        await user.type(subject, 'Dorm issue');
        
        const description = screen.getByPlaceholderText(/enter the description of your query/i);
        await user.type(description, 'I have no hot water in my dorm room');
        
        const message = screen.getByPlaceholderText(/enter your message to the team/i);
        await user.type(message, 'Any updates? It has been 2 days since my hot water went out');
        
        // Missing non-required attachment field
        const attachments = screen.getByPlaceholderText(/optionally attach relevant files/i);

        await user.click(screen.getByRole('button', {name: /send ticket/i}));

        expect(api.post).toHaveBeenCalledTimes(1);

        expect(api.post).toHaveBeenCalledWith("api/tickets/", {
            "subject": "Dorm issue",
            "description": "I have no hot water in my dorm room",
            "message": "Any updates? It has been 2 days since my hot water went out",
            "attachments": [],
        });

        expect(navigate).toHaveBeenCalledWith("/dashboard");
    });

})