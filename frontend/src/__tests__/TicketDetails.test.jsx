import { render, screen } from '@testing-library/react';
import TicketDetails from '../components/TicketDetails';
import { format, parseISO } from 'date-fns';

describe("TicketDetails Component", () => {
    const mockTicket = {
      subject: "Login Issue",
      description: "User cannot log in with correct credentials.",
      status: "Open",
      priority: "High",
      assigned_to: "John Doe",
      created_at: "2024-02-04T00:00:00Z", 
      closed_at: null,
    };

    test("renders ticket details correctly", () => {
      render(<TicketDetails ticket={mockTicket} />);
      const formattedDate = format(parseISO(mockTicket.created_at), "dd/MM/yyyy, HH:mm:ss");

      expect(screen.getByText(mockTicket.subject)).toBeInTheDocument();
      expect(screen.getByText(`"${mockTicket.description}"`)).toBeInTheDocument();
      expect(screen.getByText(`Status: ${mockTicket.status}`)).toBeInTheDocument();
      expect(screen.getByText(`Priority: ${mockTicket.priority}`)).toBeInTheDocument();
      expect(screen.getByText(`Assigned to: ${mockTicket.assigned_to}`)).toBeInTheDocument();
      expect(screen.getByText(`Created at: ${formattedDate}`)).toBeInTheDocument();
      expect(screen.getByText("Closed at: Not Set")).toBeInTheDocument();
    });
  
    test("renders default values for missing ticket fields", () => {
      const incompleteTicket = {
        subject: "Bug Report",
        description: "App crashes on startup.",
        status: "Pending",
      };
  
      render(<TicketDetails ticket={incompleteTicket} />);
  
      expect(screen.getByText(incompleteTicket.subject)).toBeInTheDocument();
      expect(screen.getByText(`"${incompleteTicket.description}"`)).toBeInTheDocument();
      expect(screen.getByText(`Status: ${incompleteTicket.status}`)).toBeInTheDocument();
      expect(screen.getByText("Priority: Not Set")).toBeInTheDocument();
      expect(screen.getByText("Assigned to: Unassigned")).toBeInTheDocument();
      expect(screen.getByText("Created at: Not Set")).toBeInTheDocument();
      expect(screen.getByText("Closed at: Not Set")).toBeInTheDocument();
    });
  });
