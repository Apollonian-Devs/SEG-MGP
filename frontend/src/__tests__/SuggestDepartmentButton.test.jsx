import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SuggestDepartmentButton from "../components/SuggestDepartmentButton";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

vi.mock("../api");

describe("SuggestDepartmentButton", () => {
  const mockSetSuggestedDepartments = vi.fn();
  const mockTickets = [
    { id: 1, subject: "Ticket 1", description: "Description 1" },
    { id: 2, subject: "Ticket 2", description: "Description 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(ACCESS_TOKEN, "test-token");
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

  test("successfully fetches departments and updates state", async () => {
    api.post
      .mockResolvedValueOnce({ data: { suggested_department: "IT" } })
      .mockResolvedValueOnce({ data: { suggested_department: "HR" } });

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Suggest Departments/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(2);
      expect(mockSetSuggestedDepartments).toHaveBeenCalledWith({
        1: "IT",
        2: "HR"
      });
    });
  });

  test("handles partial success with mixed responses", async () => {
    api.post
      .mockResolvedValueOnce({ data: { suggested_department: "IT" } })
      .mockRejectedValueOnce(new Error("API Error"));

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Suggest Departments/i }));

    await waitFor(() => {
      expect(mockSetSuggestedDepartments).toHaveBeenCalledWith({
        1: "IT"
      });
    });
  });

  test("handles API errors with response data", async () => {
    const error = { 
      response: { data: { detail: "Invalid ticket" } },
      message: "API Error"
    };
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.post.mockRejectedValue(error);

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Suggest Departments/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching suggested department:",
        {detail: "Invalid ticket"}
      );
      expect(mockSetSuggestedDepartments).toHaveBeenCalledWith({});
    });
    consoleErrorSpy.mockRestore();
  });

  test("handles network errors without response", async () => {
    const error = new Error("Network Error");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.post.mockRejectedValue(error);

    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={mockTickets}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Suggest Departments/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching suggested department:",
        "Network Error"
      );
      expect(mockSetSuggestedDepartments).toHaveBeenCalledWith({});
    });
    consoleErrorSpy.mockRestore();
  });

  test("handles empty tickets array", async () => {
    render(
      <SuggestDepartmentButton
        setSuggestedDepartments={mockSetSuggestedDepartments}
        tickets={[]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Suggest Departments/i }));

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
      expect(mockSetSuggestedDepartments).not.toHaveBeenCalled();
    });
  });
});