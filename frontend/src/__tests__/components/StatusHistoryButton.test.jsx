import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusHistoryButton from '../../components/StatusHistoryButton';
import api from "../../api";
import handleApiError from "../../utils/errorHandler"; 

// Mock API and error handler
vi.mock('../../api');
vi.mock("../../utils/errorHandler", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("StatusHistoryButton", () => {
  it("fetches status history correctly", async () => {
    api.get.mockResolvedValue({
      data: {
        status_history: [{ notes: "note 1" }],
      },
    });

    render(<StatusHistoryButton />);
    
    await waitFor(() => 
      expect(screen.getByText("note 1")).toBeInTheDocument()
    );
  });

  it("fetches status history with error", async () => {
    api.get.mockRejectedValue(new Error("test fetch error"));

    render(<StatusHistoryButton />);

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalledWith(
        expect.any(Error), 
        "Error fetching status history"
      );
    });
  });

  it("fetches status history with error response data", async () => {
    api.get.mockRejectedValue({
      response: {
        data: "fetch error data",
      },
    });

    render(<StatusHistoryButton />);

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalledWith(
        expect.objectContaining({ response: { data: "fetch error data" } }), 
        "Error fetching status history"
      );
    });
  });
});
