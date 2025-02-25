import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App.jsx";

describe("Main entry point", () => {
  it("renders the App component inside BrowserRouter", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome to Name/i)).toBeInTheDocument(); // Adjust this to match your actual text
  });
});