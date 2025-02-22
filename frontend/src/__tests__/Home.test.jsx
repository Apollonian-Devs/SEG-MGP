import { render, screen } from '@testing-library/react';
import Home from "../pages/Home";
import { expect } from "vitest";
import { MemoryRouter } from 'react-router-dom';

describe(Home, () => {
    it("Home page should be correctly rendered with static text", () => {
        render(<MemoryRouter><Home /></MemoryRouter>)
        
        const welcomeMessage = screen.getByText(/welcome to name/i);
        expect(welcomeMessage).toBeInTheDocument();
        
        const noAccountMessage = screen.getByText(/no account?/i);
        expect(noAccountMessage).toBeInTheDocument();
    });

    it("Home page should contain register hyperlink", () => {
        render(<MemoryRouter><Home /></MemoryRouter>)

        const registerLink = screen.getByRole("link", {name: /register/i});
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute("href", "/register");
    });

    it("Home page should contain LoginForm component", () => {
        render(<MemoryRouter><Home /></MemoryRouter>)

        const loginForm = screen.getByTestId("login-form");
        expect(loginForm).toBeInTheDocument();
    });
});