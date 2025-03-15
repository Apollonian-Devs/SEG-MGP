import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Dashboard from "../pages/Dashboard";
import TicketsCard from "../components/TicketsCard";
import api from "../api";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import React from "react";

vi.mock("../api");

describe("TicketsCard - rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(ACCESS_TOKEN, "mock_access_token");
  });

  it("Tickets Card - render default elements", () => {
    render(
      <TicketsCard
        user={{}}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );
    expect(screen.getByText("Tickets")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tickets-dropdown")).toBeInTheDocument();
    expect(screen.getByText(/rows per page:/i)).toBeInTheDocument();

    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    screen.getByRole("button", { name: /chat/i });
    expect(screen.getByText("ticket 1")).toBeInTheDocument();
  });

  it("Tickets Card should display extra table headings if the user is an officer", () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };
    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    screen.getByRole("button", { name: /chat/i });
    expect(screen.getByTestId("toggle-status")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-priority")).toBeInTheDocument();
    expect(screen.getByTestId("more-actions-dropdown")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /select an officer/i }))
      .toBeInTheDocument;
    expect(screen.getByRole("button", { name: /redirect/i })).toBeInTheDocument;

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    // Assert that "Change Due Date" button appears
    expect(
      screen.getByRole("button", { name: /change due date/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/suggested departments/i)
    ).not.toBeInTheDocument();
  });

  it("Tickets Card should display extra table headings and buttons if the user is an admin", async () => {
    vi.spyOn(React, "useState").mockReturnValueOnce([
      { 1: { id: 101, name: "IT Support" } },
      vi.fn(),
    ]);

    render(
      <TicketsCard
        user={{ is_staff: true, is_superuser: true }}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    expect(screen.getByTestId("status-history-button")).toBeInTheDocument();
    expect(screen.getByTestId("ticket-path-button")).toBeInTheDocument();

    // Close More Actions dropdown
    fireEvent.click(moreActionsButton);

    // Open AI Suggestion dropdown
    const AISuggestionButton = screen.getByRole("button", {
      name: /ai suggestion/i,
    });
    fireEvent.click(AISuggestionButton);

    expect(screen.getByRole("button", { name: /suggest departments/i }))
      .toBeInTheDocument;
    expect(screen.getByRole("button", { name: /suggest ticket grouping/i }))
      .toBeInTheDocument;

    // Close AI Suggestion dropdown
    fireEvent.click(AISuggestionButton);
    screen.debug();

    // Suggested department column and Redirect button
    expect(screen.getByText(/suggested departments/i)).toBeInTheDocument();
    expect(screen.getByTestId("suggested-redirect-button")).toBeInTheDocument();
  });

  it("Tickets Card should show 'No suggestion' when there are no suggested departments", () => {
    vi.spyOn(React, "useState").mockReturnValueOnce([{}, vi.fn()]);

    render(
      <TicketsCard
        user={{ is_staff: true, is_superuser: true }}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    const ticketRow = screen.getByRole("row", { name: /ticket 1/i });

    const cells = within(ticketRow).getAllByRole("cell");

    const suggestionCell = cells.find((cell) =>
      within(cell).queryByText("No suggestion")
    );

    expect(suggestionCell).toBeInTheDocument();
  });

  it("Ticket status should be changed when toggled", async () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    const mockFetchTickets = vi.fn();

    api.get.mockResolvedValue({ data: { message: "Success" } });

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const toggleStatusButton = screen.getByTestId("toggle-status");
    fireEvent.click(toggleStatusButton);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/api/tickets/change-status/1/",
        expect.objectContaining({
          headers: { Authorization: "Bearer mock_access_token" },
        })
      );
    });

    expect(mockFetchTickets).toHaveBeenCalled();
  });

  it("Ticket priority should be changed when toggled", async () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    const mockFetchTickets = vi.fn();

    api.get.mockResolvedValue({ data: { message: "Success" } });

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", priority: "testPriority" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const togglePriorityButton = screen.getByTestId("toggle-priority");
    fireEvent.click(togglePriorityButton);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/api/tickets/change-priority/1/",
        expect.objectContaining({
          headers: { Authorization: "Bearer mock_access_token" },
        })
      );
    });

    expect(mockFetchTickets).toHaveBeenCalled();
  });
});

describe("TicketsCard - Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(ACCESS_TOKEN, "mock_access_token");
  });

  it("handles API error when toggling status", async () => {
    const mockFetchTickets = vi.fn();

    api.get.mockRejectedValue(new Error("Network Error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[]}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const toggleStatusButton = screen.getByTestId("toggle-status");
    fireEvent.click(toggleStatusButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error changing status:",
        "Network Error"
      );
    });

    expect(mockFetchTickets).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("handles API error when toggling priority", async () => {
    const mockFetchTickets = vi.fn();

    api.get.mockRejectedValue({
      response: { data: "Priority update failed" },
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[]}
        tickets={[{ id: 1, subject: "ticket 1", priority: "testPriority" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const togglePriorityButton = screen.getByTestId("toggle-priority");
    fireEvent.click(togglePriorityButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error changing status:",
        "Priority update failed"
      );
    });

    expect(mockFetchTickets).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe("Popup", () => {
  it("Chat popup should be displayed when the chat button is pressed", async () => {
    render(
      <TicketsCard
        user={{}}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
        setSelectedTicket={vi.fn()}
        setTickets={vi.fn()}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Chat").closest("button"));
    //await waitFor(() => expect(screen.getByText(/chat for ticket/i)).toBeInTheDocument());
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Chat").closest("button"));
    const buttons2 = screen.getAllByRole("button");
    fireEvent.click(buttons2[0]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
  });

  it("Change date popup", async () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={vi.fn()}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByText(/change due date/i).closest("button"));
    await waitFor(() =>
      expect(screen.getByText(/change date/i)).toBeInTheDocument()
    );
  });

  it("Status history popup", async () => {
    const mockSetSelectedTicket = vi.fn();

    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true, is_superuser: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={mockSetSelectedTicket}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByTestId("status-history-button"));
    await waitFor(() =>
      expect(screen.getByText(/old status/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/new status/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/changed by/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/changed at/i)).toBeInTheDocument()
    );
    await waitFor(() => expect(screen.getByText(/notes/i)).toBeInTheDocument());

    const closeButton = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeButton);

    expect(mockSetSelectedTicket).toHaveBeenCalledWith(null);
  });

  it("Ticket path popup", async () => {
    const mockSetSelectedTicket = vi.fn();

    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true, is_superuser: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={mockSetSelectedTicket}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByTestId("ticket-path-button"));
    await waitFor(() =>
      expect(screen.getByText(/redirected from/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/redirected to/i)).toBeInTheDocument()
    );

    const closeButton = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeButton);

    expect(mockSetSelectedTicket).toHaveBeenCalledWith(null);
  });

  it("Ticket details popup", async () => {
    const mockOpenPopup = vi.fn();
    const mockSetSelectedTicket = vi.fn();

    render(
      <TicketsCard
        user={{}}
        tickets={[
          {
            id: 1,
            subject: "ticket 1",
            status: "testStatus",
            due_date: "2025-12-31",
          },
        ]}
        setSelectedTicket={mockSetSelectedTicket}
        setTickets={vi.fn()}
        openPopup={mockOpenPopup}
      />
    );

    const cell = screen.getByRole("cell", { name: /ticket 1/i });
    fireEvent.click(cell);

    expect(mockSetSelectedTicket).toHaveBeenCalled();
    expect(mockOpenPopup).toHaveBeenCalled();

    //const closeButton = screen.getByRole("button", { name: "✕" });
    //fireEvent.click(closeButton);
  });
});

// Wrapper written by GPT
const SubjectAndSameStatusTest = () => {
  const [tickets, setTickets] = useState([
    { id: 1, subject: "ticket 1", status: "test status" },
    { id: 2, subject: "ticket 2", status: "test status" },
  ]);

  return (
    <TicketsCard
      user={{}}
      tickets={tickets}
      setSelectedTicket={vi.fn()}
      setTickets={setTickets}
    />
  );
};
describe("Sorting", () => {
  it("Tickets are correctly sorted by subject when subject is clicked", async () => {
    render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    await waitFor(() => screen.getByText("ticket 2"));

    fireEvent.click(screen.getByText("Subject").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Subject").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");

    expect(within(rowsDesc[1]).getByText("ticket 2")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("ticket 1")).toBeInTheDocument();
  });

  it("Sorting is handled correctly when status is clicked and both status's are the same", async () => {
    render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status")).toBeInTheDocument();
  });

  const DifferentStatusTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status a" },
      { id: 2, subject: "ticket 2", status: "test status b" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by status when status is clicked", async () => {
    render(<DifferentStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status a")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status b")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");
    expect(within(rowsDesc[1]).getByText("test status b")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("test status a")).toBeInTheDocument();
  });

  const DifferentPrioritiesTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status", priority: "Low" },
      { id: 2, subject: "ticket 2", status: "test status", priority: "High" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by priority when priority is clicked", async () => {
    render(<DifferentPrioritiesTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Priority").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("High")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("Low")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Priority").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");
    expect(within(rowsDesc[1]).getByText("Low")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("High")).toBeInTheDocument();
  });

  it("should correctly handle sorting when some values are null or undefined", async () => {
    const mockTickets = [
      { id: 1, subject: "Ticket A", status: "Open", priority: "High" },
      { id: 2, subject: "Ticket B", status: "Closed", priority: "Low" },
      { id: 3, subject: "Ticket C", status: "Closed", priority: null },
      { id: 4, subject: "Ticket D", status: "Closed", priority: undefined },
    ];

    render(
      <TicketsCard
        user={{}}
        tickets={mockTickets}
        setTickets={vi.fn()}
        fetchTickets={vi.fn()}
        openPopup={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Priority").closest("button"));

    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("Not Set")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("Not Set")).toBeInTheDocument();
    expect(within(rowsAsc[3]).getByText("High")).toBeInTheDocument();
    expect(within(rowsAsc[4]).getByText("Low")).toBeInTheDocument();
  });
});

describe("TicketsCard - Filtering", () => {
  let tickets;
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = { is_staff: true };
    tickets = [
      {
        id: 1,
        subject: "Ticket 1",
        priority: "High",
        status: "Open",
        is_overdue: true,
      },
      {
        id: 2,
        subject: "Ticket 2",
        priority: "Medium",
        status: "Closed",
        is_overdue: false,
      },
      {
        id: 3,
        subject: "Ticket 3",
        priority: "Low",
        status: "Open",
        is_overdue: false,
      },
      {
        id: 4,
        subject: "Ticket 4",
        priority: "High",
        status: "In Progress",
        is_overdue: true,
      },
    ];
  });

  it("applies priority filter correctly", async () => {
    render(<TicketsCard user={user} tickets={tickets} />);

    // Select "High" priority
    fireEvent.click(screen.getByText(/priority/i));
    fireEvent.click(screen.getByLabelText(/High/i));

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });

    // Ensure non-high priority tickets are filtered out
    expect(screen.queryByText("Ticket 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket 3")).not.toBeInTheDocument();
  });

  it("applies status filter correctly", async () => {
    render(<TicketsCard user={user} tickets={tickets} />);

    // Select "Open" status
    fireEvent.click(screen.getByText(/status/i));
    fireEvent.click(screen.getByLabelText(/Open/i));

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 3")).toBeInTheDocument();
    });

    // Ensure non-"Open" tickets are filtered out
    expect(screen.queryByText("Ticket 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket 4")).not.toBeInTheDocument();
  });

  it("applies overdue filter correctly", async () => {
    render(<TicketsCard user={user} tickets={tickets} />);

    // Select "Overdue"
    fireEvent.click(screen.getByText(/overdue/i));
    fireEvent.click(screen.getByLabelText(/Yes/i));

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });

    // Ensure non-overdue tickets are filtered out
    expect(screen.queryByText("Ticket 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket 3")).not.toBeInTheDocument();
  });

  it("ensures redirected tickets are not shown", async () => {
    render(
      <TicketsCard
        user={user}
        tickets={tickets}
        redirectedIds={new Set([1, 3])}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText("Ticket 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Ticket 3")).not.toBeInTheDocument();
    });

    // Remaining tickets should be visible
    expect(screen.getByText("Ticket 2")).toBeInTheDocument();
    expect(screen.getByText("Ticket 4")).toBeInTheDocument();
  });

  it("clears filters correctly and restores all tickets", async () => {
    render(<TicketsCard user={user} tickets={tickets} />);

    // Apply a filter
    fireEvent.click(screen.getByText(/priority/i));
    fireEvent.click(screen.getByLabelText(/High/i));

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });

    // Click "Clear Filters"
    fireEvent.click(screen.getByText(/clear/i));

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 2")).toBeInTheDocument();
      expect(screen.getByText("Ticket 3")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });
  });
});
