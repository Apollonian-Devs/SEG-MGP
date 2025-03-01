import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SuggestDepartmentButton from "../components/SuggestDepartmentButton";
import api from "../api";

// Mock API requests
vi.mock("../api");

describe("SuggestDepartmentButton", () => {
  const mockSetSuggestedDepartments = vi.fn();
  const mockTickets = [
    { id: 1, subject: "Ticket 1" },
    { id: 2, subject: "Ticket 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mock function calls before each test
  });

  test("renders the button correctly", () => {
    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    expect(
      screen.getByRole("button", { name: /Suggest Departments/i })
    ).toBeInTheDocument();
  });

  test("fetches random department and updates state when clicked", async () => {
    // Mock API response for random department
    api.get.mockResolvedValueOnce({
      data: { id: 101, name: "IT Department" },
    });

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Departments/i });
    fireEvent.click(button);

    // Wait for all API calls to finish
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(mockTickets.length); // Should call API for each ticket
      expect(mockSetSuggestedDepartments).toHaveBeenCalled(); // Ensure state is updated
    });
  });

  test("handles API errors gracefully", async () => {
    // Mock API error response
    api.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Departments/i });
    fireEvent.click(button);

    // Wait for API call to be made
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(mockTickets.length);
      expect(mockSetSuggestedDepartments).toHaveBeenCalled();
    });
  });
});
