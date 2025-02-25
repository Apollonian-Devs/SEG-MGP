import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import App from "../App";
import { ACCESS_TOKEN } from '../constants';
import {jwtDecode} from 'jwt-decode';


const mockJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjozMjYwMDAwMDB9.signature";

vi.mock("../api", () => ({
    default: {
        post: vi.fn((url) => {
            if (url === "/api/token/refresh/") {
                return Promise.resolve({ status: 200, data: { access: "new-access-token" } });
            }
            return Promise.reject(new Error(`Unhandled API call: POST ${url}`));
        }),
        get: vi.fn((url) => {
            if (url === "/api/current_user/") {
                return Promise.resolve({ 
                    status: 200, 
                    data: { 
                        id: 1, 
                        username: "testuser", 
                        is_staff: false, 
                        is_superuser: false 
                    } 
                });
            }
            if (url === "/api/user-tickets/") {
                return Promise.resolve({ status: 200, data: [{ id: 101, title: "Ticket 1" }] });
            }
            return Promise.reject(new Error(`Unhandled API call: GET ${url}`));
        }),
    },
}));


vi.mock('jwt-decode', () => ({
    __esModule: true,
    jwtDecode: vi.fn(), // Use named export for consistency
  }));
  

describe("App Routing", () => {
    it("renders the home page by default", () => {
        render(
            <MemoryRouter>
            <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Welcome to Name/i)).toBeInTheDocument();
    });

    it("renders the NotFound page for an unknown route", () => {
        render(
            <MemoryRouter initialEntries={["/random-route"]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/NotFound/i)).toBeInTheDocument();

    });
});

describe('Logout', () => {
    it("clears localStorage and redirects when visiting /logout", () => {
        vi.spyOn(Storage.prototype, "clear");
        
        render(
            <MemoryRouter initialEntries={["/logout"]}>
            <App />
            </MemoryRouter>
        );
      
        expect(localStorage.clear).toHaveBeenCalled();
        expect(screen.getByText(/Welcome to Name/i)).toBeInTheDocument();
    });
});

describe('RegisterAndLogout', () => {
    it('navigating to /register clears localStorage and renders Register page', () => {
        vi.spyOn(Storage.prototype, 'clear');
      
        render(
          <MemoryRouter initialEntries={["/register"]}>
            <App />
          </MemoryRouter>
        );
      
        expect(localStorage.clear).toHaveBeenCalled();
        expect(screen.getByTestId("register-component")).toBeInTheDocument();
    });
});

describe("ProtectedRoute", () => {
    beforeEach(() => {
        localStorage.setItem(ACCESS_TOKEN, 'valid_token');
        jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 5000 });
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("renders the protected page if the user is authorized", async () => {
        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            </MemoryRouter>
        );

        await waitFor(
            () => expect(screen.getByTestId("dashboard-container")).toBeInTheDocument(),
            { timeout: 3000 }
            );

        
    });

    it("redirects to home if user is unauthorized", async () => {
        localStorage.clear();
    
        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.queryByText(/Welcome to Name/i)).toBeInTheDocument();
        });
    
        expect(window.location.pathname).toBe("/");
    });
});
