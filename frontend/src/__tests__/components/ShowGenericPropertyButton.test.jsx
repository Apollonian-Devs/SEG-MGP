import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ShowGenericPropertyButton from "../../components/ShowGenericPropertyButton";
import api from "../../api";

vi.mock("../../api", () => ({
  default: { get: vi.fn() },
}));

describe("ShowGenericPropertyButton Component", () => {
  let mockSetTickets;
  const mockAllTickets = [
    { id: 1, subject: "Test Ticket 1" },
    { id: 2, subject: "Test Ticket 2" },
  ];

  beforeEach(() => {
    mockSetTickets = vi.fn();
  });

  it("renders with initial button text", () => {
    render(
      <ShowGenericPropertyButton
        endpoint="/api/tickets"
        buttonText="Show Open Tickets"
        setTickets={mockSetTickets}
        allTickets={mockAllTickets}
      />
    );

    expect(screen.getByText("Show Open Tickets")).toBeInTheDocument();
  });

  it("fetches and sets filtered tickets when clicked", async () => {
    const mockFilteredTickets = [{ id: 3, subject: "Filtered Ticket" }];
    api.get.mockResolvedValueOnce({ data: { tickets: mockFilteredTickets } });

    render(
      <ShowGenericPropertyButton
        endpoint="/api/tickets"
        buttonText="Show Open Tickets"
        setTickets={mockSetTickets}
        allTickets={mockAllTickets}
      />
    );

    const button = screen.getByText("Show Open Tickets");
    fireEvent.click(button);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tickets", expect.anything()));
    await waitFor(() => expect(mockSetTickets).toHaveBeenCalledWith(mockFilteredTickets));
    expect(button.textContent).toBe("Show All Tickets");
  });
});
