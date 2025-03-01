import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ShowOverdueButton from "../components/ShowOverdueButton";

// Correctly mock `api.get` which is a named export, not a default export
vi.mock("../api", async () => {
  return {
    default: {
      get: vi.fn(() => Promise.resolve({ data: { tickets: [] } })),
    },
  };
});

describe("ShowOverdueButton", () => {
  it("renders the button correctly", () => {
    render(<ShowOverdueButton setTickets={() => {}} allTickets={[]} />);
    expect(screen.getByText("Show Overdue Tickets")).toBeInTheDocument();
  });

  it("toggles the button text when clicked", async () => {
    render(<ShowOverdueButton setTickets={() => {}} allTickets={[]} />);

    // Query the button with the initial text.
    const button = screen.getByText("Show Overdue Tickets");
    expect(button).toBeInTheDocument();

    // Click the button.
    await userEvent.click(button);

    // Wait for the state update and check that the text has toggled.
    await waitFor(() => {
      expect(screen.getByText("Show All Tickets")).toBeInTheDocument();
    });
  });

  it('restores the original tickets when clicked again', async () => {
    render(<ShowOverdueButton setTickets={() => {}} allTickets={[]} />);

    // Query the button with the initial text.
    const button = screen.getByText("Show Overdue Tickets");
    expect(button).toBeInTheDocument();

    // Click the button.
    await userEvent.click(button);

    // Wait for the state update and check that the text has toggled.
    await waitFor(() => {
      expect(screen.getByText("Show All Tickets")).toBeInTheDocument();
    });

    // Click the button again.
    await userEvent.click(screen.getByText("Show All Tickets"));

    // Wait for the state update and check that the text has toggled back.
    await waitFor(() => {
      expect(screen.getByText("Show Overdue Tickets")).toBeInTheDocument();

});
    });

    it('restores the original tickets when clicked again', async () => {
        render(<ShowOverdueButton setTickets={() => {}} allTickets={[]} />);
        const button = screen.getByText("Show Overdue Tickets");
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        await waitFor(() => {
        expect(screen.getByText("Show All Tickets")).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText("Show All Tickets"));
        await waitFor(() => {
        expect(screen.getByText("Show Overdue Tickets")).toBeInTheDocument();
        });
    });

    it('fetches overdue tickets when clicked', async () => {
        const setTickets = vi.fn();
        render(<ShowOverdueButton setTickets={setTickets} allTickets={[]} />);
        const button = screen.getByText("Show Overdue Tickets");
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        await waitFor(() => {
        expect(setTickets).toHaveBeenCalledWith([]);
        });
    });

    /*it ('shows an error message when fetching overdue tickets fails', async () => {
        vi.mock("../api", async () => {
            return {
                default: {
                    get: vi.fn(() => Promise.reject(new Error("Failed to fetch overdue tickets"))),
                },
            };
        });

        api.post.mockClear();

        render(<ShowOverdueButton setTickets={() => {}} allTickets={[]} />);
        const button = screen.getByText("Show Overdue Tickets");
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        await waitFor(() => {
        expect(screen.getByText("Failed to fetch overdue tickets")).toBeInTheDocument();
        });
        
    });*/

});


