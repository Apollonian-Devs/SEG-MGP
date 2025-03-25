import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicketPathButton from '../../components/TicketPathButton';
import api from "../../api";
import handleApiError from "../../utils/errorHandler";

vi.mock('../../api');
vi.mock("../../utils/errorHandler", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("TicketPathButton", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("ACCESS_TOKEN", "mock-token");
  });

  it("fetches Ticket Path correctly", async () => {
    api.get.mockResolvedValue({
      data: {
        ticket_path: [
          { from_username: "user 1", to_username: "user 2" },
        ],
      },
    });

    render(<TicketPathButton ticketId={1} />);
    await waitFor(() => {
      expect(screen.getByText("user 1")).toBeInTheDocument();
      expect(screen.getByText("user 2")).toBeInTheDocument();
    });
  });

  it("handles fetch error correctly without response data", async () => {
    const mockError = new Error("Network error");
    api.get.mockRejectedValue(mockError);

    render(<TicketPathButton ticketId={1} />);

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalledWith(mockError, "Error fetching ticket path");
    });
  });

  it("handles fetch error correctly with response data", async () => {
    const mockError = {
      response: {
        data: "fetch path error data",
      },
    };
    api.get.mockRejectedValue(mockError);

    render(<TicketPathButton ticketId={1} />);

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalledWith(mockError, "Error fetching ticket path");
    });
  });
});
