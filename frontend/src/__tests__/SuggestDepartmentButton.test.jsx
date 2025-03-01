import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SuggestDepartmentButton from "../components/SuggestDepartmentButton";
import api from "../api";

vi.mock("../api");

describe("SuggestDepartmentButton", () => {
  const mockSetSuggestedDepartments = vi.fn();
  const mockTickets = [
    { id: 1, subject: "Ticket 1" },
    { id: 2, subject: "Ticket 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the button correctly", () => {
    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    expect(screen.getByRole("button", { name: /Suggest Departments/i })).toBeInTheDocument();
  });

  test("fetches random department and updates state when clicked", async () => {
    api.get.mockResolvedValueOnce({ data: { id: 101, name: "IT Department" } });

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Departments/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(mockTickets.length);
      expect(mockSetSuggestedDepartments).toHaveBeenCalled();
    });
  });

  test("handles API errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    api.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Departments/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(mockTickets.length);
      expect(mockSetSuggestedDepartments).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("handles API errors when error.response is undefined", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  
    api.get.mockRejectedValueOnce(new Error("Network Error"));
  
    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );
  
    const button = screen.getByRole("button", { name: /Suggest Departments/i });
    fireEvent.click(button);
  
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(mockTickets.length);
      expect(mockSetSuggestedDepartments).toHaveBeenCalled();
    });
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching random department:",
      "Network Error"
    );
  
    consoleErrorSpy.mockRestore();
  });
  
  
});
