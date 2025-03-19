/*
import React from "react";
import { toast } from "sonner";  // ✅ Import Sonner
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";
import { playSound } from "../utils/SoundUtils";
import { handleApiError } from "../utils/errorHandler"

const SuggestTicketGroupingButton = ({ setSuggestedGrouping, tickets }) => {
    const assignRandomGrouping = async () => {
        const groupedTickets = {};
    
        try {
            const access = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.get('/api/user-tickets-grouping/', {
                headers: { Authorization: `Bearer ${access}` },
            });
    
            if (response.data.error) {
    
                toast.error(`❌ ${response.data.error}`);
                return;
            }
    
            const clusterData = response.data.clusters;
            for (const ticket of tickets) {
                if (clusterData[ticket.id] !== undefined) {
                    groupedTickets[ticket.id] = clusterData[ticket.id];
                }
            }
    
            setSuggestedGrouping(groupedTickets);
            toast.success("✅ Ticket grouping suggestions updated!");
    
        } catch (error) {
            handleApiError(error, "Failed to fetch ticket groupings. Please try again.")
        }
    };
    

    return (
        <GenericButton
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={(e) => { 
                playSound();
                e.stopPropagation();
                assignRandomGrouping();
            }}
        >
            Suggest Ticket Grouping
        </GenericButton>
    );
};

export default SuggestTicketGroupingButton;
*/

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SuggestTicketGroupingButton from "../components/SuggestTicketGroupingButton";
import api from "../api";
import { toast } from "sonner";


vi.mock("../api");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


// ✅ Mock playSound() to prevent the jsdom error
vi.mock("../utils/SoundUtils", () => ({
  playSound: vi.fn(),
}));

  

describe("SuggestTicketGroupingButton", () => {
  const mockSetSuggestedGrouping = vi.fn();
  const mockTickets = [
    { id: 1, subject: "Ticket 1" },
    { id: 2, subject: "Ticket 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });


  test("renders the button correctly", () => {
    render(
      <SuggestTicketGroupingButton
        setSuggestedGrouping={mockSetSuggestedGrouping}
        tickets={mockTickets}
      />
    );

    expect(screen.getByRole("button", { name: /Suggest Ticket Grouping/i })).toBeInTheDocument();
  });

  test("fetches ticket groupings and updates state when clicked", async () => {
    api.get.mockResolvedValueOnce({
      data: { clusters: { 1: "Group A", 2: "Group B" } },
    });

    render(
      <SuggestTicketGroupingButton
        setSuggestedGrouping={mockSetSuggestedGrouping}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Ticket Grouping/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(mockSetSuggestedGrouping).toHaveBeenCalledWith({ 1: "Group A", 2: "Group B" });
      expect(toast.success).toHaveBeenCalledWith("✅ Ticket grouping suggestions updated!");
    });
  });


  test("✅ Handles API success but returns an error message", async () => {
  
    api.get.mockResolvedValueOnce({
        data: { error: "No valid ticket groupings found" }
    });

    render(<SuggestTicketGroupingButton setSuggestedGrouping={mockSetSuggestedGrouping} tickets={mockTickets} />);
    fireEvent.click(screen.getByRole("button", { name: /Suggest Ticket Grouping/i }));

    await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(mockSetSuggestedGrouping).not.toHaveBeenCalled(); 
        expect(toast.error).toHaveBeenCalledWith("❌ Unable to group tickets. Please try again.")
    });
   
});



  test("handles API errors gracefully and logs errors to console", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    api.get.mockRejectedValueOnce({
      response: { data: { error: "API Error" } },
      message: "Request failed",
    });

    render(
      <SuggestTicketGroupingButton
        setSuggestedGrouping={mockSetSuggestedGrouping}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Ticket Grouping/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(mockSetSuggestedGrouping).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("❌ Failed to fetch ticket groupings. Please try again.");
    });

    // ✅ Now testing the actual console.error calls correctly
    expect(consoleErrorSpy).toHaveBeenCalledWith({
      response: { data: { error: "API Error" } },
      message: "Request failed",
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith({ error: "API Error" });

    expect(consoleErrorSpy).toHaveBeenCalledWith("Request failed");

    consoleErrorSpy.mockRestore();
});




  test("handles network errors when `error.response` is undefined", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    api.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <SuggestTicketGroupingButton
        setSuggestedGrouping={mockSetSuggestedGrouping}
        tickets={mockTickets}
      />
    );

    const button = screen.getByRole("button", { name: /Suggest Ticket Grouping/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(mockSetSuggestedGrouping).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("❌ Failed to fetch ticket groupings. Please try again.");
    });

    // ✅ Now we correctly test console.error()
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Network Error"));

    consoleErrorSpy.mockRestore();
  });
});
