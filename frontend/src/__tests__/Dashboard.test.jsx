import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import api from "../api"; 
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("../api");

describe("Dashboard Component", () => {
    let consoleErrorSpy;
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.setItem("ACCESS_TOKEN", "testtoken");
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    const renderWithRouter = (ui) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };

    it("should render loading initially", () => {
        renderWithRouter(<Dashboard />);
        expect(screen.getByText("Loading user details...")).toBeInTheDocument();
    });

    it("renders Dashboard after loading current user", async () => {
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });

        renderWithRouter(<Dashboard />);
        
        expect(await screen.findByTestId("dashboard-container")).toBeInTheDocument();
        expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("fetches and displays tickets", async () => {
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [{ id: 1, subject: "test ticket" }] } });

        renderWithRouter(<Dashboard />);
        
        await waitFor(() => {
            screen.debug(); // ✅ Debugging
            expect(screen.getByText("test ticket")).toBeInTheDocument();
        });

        expect(api.get).toHaveBeenCalledWith("/api/user-tickets/", expect.any(Object));
    });


    //---written by chatgpt----------------------------------------------
    it("fetches officers if user is staff", async () => {
        // Use a custom implementation for api.get to handle all three endpoints
        api.get.mockImplementation((url) => {
          if (url === "/api/current_user/") {
            return Promise.resolve({ data: { id: 1, username: "staffuser", is_staff: true } });
          }
          if (url === "/api/user-tickets/") {
            return Promise.resolve({ data: { tickets: [{ id: 101, subject: "dummy ticket" }] } });
          }
          if (url === "/api/all-officers/") {
            return Promise.resolve({
              data: {
                officers: [{ user: { id: 5, username: "test officer" } }],
                admin: { id: 2, username: "adminUser" }
              }
            });
          }
          return Promise.reject(new Error(`Unexpected API call to: ${url}`));
        });
    
        renderWithRouter(<Dashboard />);
    
        // Wait for the current user (staff) to appear
        await waitFor(() =>
          expect(screen.getByRole("button", { name: /staffuser/i })).toBeInTheDocument()
        );
    
        // Debug the DOM (optional)
        screen.debug();
    
        // Assuming your OfficersDropdown renders a button whose default text is "Select an officer"
        // We try to locate that dropdown button.
        const dropdownButton = screen.getByText(/select an officer/i);
        expect(dropdownButton).toBeTruthy();
    
        // Click the dropdown to open the list
        userEvent.click(dropdownButton);
    
        // Now wait for the officer's username to appear
        await waitFor(() => {
          expect(screen.getByText(/test officer/i)).toBeInTheDocument();
        });
    
        expect(api.get).toHaveBeenCalledWith("/api/all-officers/", expect.any(Object));
      });
      //---TEST ABOVE IS written by chatgpt----------------------------------------------

    

    it("opens and closes popup correctly", async () => {
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });

        renderWithRouter(<Dashboard />);
        await screen.findByTestId("dashboard-container");

        expect(screen.queryByTestId("popup-overlay")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("New"));

        await waitFor(() => {
            expect(screen.getByTestId("popup-overlay")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("✕"));

        await waitFor(() => {
            expect(screen.queryByTestId("popup-overlay")).not.toBeInTheDocument();
        });
    });

    it("displays NewTicketButton for non-staff users", async () => {
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });

        renderWithRouter(<Dashboard />);

        expect(await screen.findByTestId("dashboard-container")).toBeInTheDocument();
        expect(screen.getByText(/new/i)).toBeInTheDocument();
    });

    it("does not fetch officers for non-staff users", async () => {
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });

        renderWithRouter(<Dashboard />);
        await screen.findByTestId("dashboard-container");

        expect(api.get).not.toHaveBeenCalledWith("/api/all-officers/", expect.any(Object));
    });

    it("fails to fetch officers for staff users due to error", async () => {
        // Simulate a successful current user (staff) and tickets, but an error when fetching officers.
        api.get
          .mockResolvedValueOnce({ data: { id: 1, username: "testuser", is_staff: true } })
          .mockResolvedValueOnce({ data: { tickets: [] } })
          .mockRejectedValueOnce(new Error("Error Fetching officers"));
    
        renderWithRouter(<Dashboard />);
        await screen.findByTestId("dashboard-container");
    
        // Since Dashboard does not render error messages on fetch failures,
        // we verify that console.error was called with the expected error.
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error fetching officers",
            "Error Fetching officers"
          );
        });
      });
    
      it("fails to fetch tickets due to error", async () => {
        api.get
          .mockResolvedValueOnce({ data: { id: 2, username: "testuser", is_staff: false } })
          .mockRejectedValueOnce(new Error("Error Fetching tickets"));
    
        renderWithRouter(<Dashboard />);
        await screen.findByTestId("dashboard-container");
    
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error fetching tickets:",
            "Error Fetching tickets"
          );
        });
      });
    
      it("fails to fetch current user due to error", async () => {
        api.get.mockRejectedValueOnce(new Error("Error Fetching current user"));
    
        renderWithRouter(<Dashboard />);
        // Since current_user remains null, Dashboard keeps showing the loading message.
        await waitFor(() => {
          expect(screen.getByText("Loading user details...")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error fetching current user:",
            "Error Fetching current user"
          );
        });
      });
    
    
      it("sets popup type and opens popup (e.g. 'addTicket')", async () => {

        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });
    
        renderWithRouter(<Dashboard />);
    
        await screen.findByTestId("dashboard-container");
    
        // The "New" button presumably triggers openPopup("addTicket")
        const newButton = screen.getByText("New");
        userEvent.click(newButton);
    
   
        await waitFor(() => {
          expect(screen.getByTestId("popup-overlay")).toBeInTheDocument();
        });
      });
    
      it("sets popup type and ticket when opening popup for a ticket (e.g. 'viewTicket')", async () => {
        const testTicket = { id: 1, subject: "Test Ticket" };
    
        // Mock user + tickets containing "Test Ticket"
        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [testTicket] } });
    
        renderWithRouter(<Dashboard />);
    
        // Wait for dashboard to finish loading
        await screen.findByTestId("dashboard-container");
    
        // Suppose your code triggers openPopup('viewTicket', ticket) when 
        // the user clicks the ticket row with text "Test Ticket".
        const ticketRow = await screen.findByText("Test Ticket");
        userEvent.click(ticketRow);
    
     
        await waitFor(() => {
          expect(screen.getByTestId("popup-overlay")).toBeInTheDocument();
        });
    

      });
    
      it("closes popup correctly", async () => {

        api.get.mockResolvedValueOnce({ data: { username: "testuser", is_staff: false } });
        api.get.mockResolvedValueOnce({ data: { tickets: [] } });
    
        renderWithRouter(<Dashboard />);
    
        await screen.findByTestId("dashboard-container");
    

        userEvent.click(screen.getByText("New"));
        await waitFor(() => {
          expect(screen.getByTestId("popup-overlay")).toBeInTheDocument();
        });
    
       
        const closeButton = screen.getByText("✕");
        userEvent.click(closeButton);
    
    
        await waitFor(() => {
          expect(screen.queryByTestId("popup-overlay")).not.toBeInTheDocument();
        });
      });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        localStorage.clear();
    });

});
