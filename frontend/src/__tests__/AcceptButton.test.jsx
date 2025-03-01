import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AcceptButton from "../components/AcceptButton";
import api from "../api";
import { vi } from "vitest";

vi.mock("../api");

describe("AcceptButton", () => {
  const mockTicketId = 1;
  const mockSelectedOfficer = { user: { id: 42, username: "officer1" } };
  const mockDepartmentId = 101;

  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  test("renders the Accept button correctly", () => {
    render(<AcceptButton ticketid={mockTicketId} selectedOfficer={null} departmentId={null} />);
    expect(screen.getByRole("button", { name: /Accept/i })).toBeInTheDocument();
  });

  //test("button is disabled when neither selectedOfficer nor departmentId is set", () => {
  //  render(<AcceptButton ticketid={mockTicketId} selectedOfficer={null} departmentId={null} />);
  //  expect(screen.getByRole("button", { name: /Accept/i })).toBeDisabled();
  //});

  test("calls API correctly when selectedOfficer is provided", async () => {
    api.post.mockResolvedValueOnce({ data: { message: "Redirected successfully" } });

    render(<AcceptButton ticketid={mockTicketId} selectedOfficer={mockSelectedOfficer} departmentId={null} />);
    
    const button = screen.getByRole("button", { name: /Accept/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/redirect-ticket/",
        {
          ticket: mockTicketId,
          to_profile: mockSelectedOfficer.user.id,
          department_id: null,
        },
        { headers: { Authorization: expect.any(String) } }
      );
    });
  });

  test("calls API correctly when departmentId is provided", async () => {
    api.post.mockResolvedValueOnce({ data: { message: "Redirected successfully" } });

    render(<AcceptButton ticketid={mockTicketId} selectedOfficer={null} departmentId={mockDepartmentId} />);
    
    const button = screen.getByRole("button", { name: /Accept/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/redirect-ticket/",
        {
          ticket: mockTicketId,
          to_profile: null,
          department_id: mockDepartmentId,
        },
        { headers: { Authorization: expect.any(String) } }
      );
    });
  });

  test("handles API errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error("API Error"));

    render(<AcceptButton ticketid={mockTicketId} selectedOfficer={mockSelectedOfficer} departmentId={null} />);
    
    const button = screen.getByRole("button", { name: /Accept/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error redirecting ticket:", expect.any(Error));
      expect(global.alert).toHaveBeenCalledWith("Failed to redirect ticket. Please try again.");
    });

    consoleErrorSpy.mockRestore();
  });
});
