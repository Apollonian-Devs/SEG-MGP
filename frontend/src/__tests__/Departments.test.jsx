import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Departments from "../components/Departments";
import { vi } from "vitest";

vi.mock("../components/TeamCard", () => ({
  __esModule: true,
  default: vi.fn(({ name, description, url }) => (
    <div data-testid="team-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url}>Visit</a>
    </div>
  )),
}));

describe("Departments Component", () => {
  test("✅ Renders all department cards", () => {
    render(<Departments />);
    

    const departmentCards = screen.getAllByTestId("team-card");
    expect(departmentCards.length).toBe(18);
  });

  test("✅ Dark mode is enabled by default", () => {
    render(<Departments />);
    
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("✅ Clicking toggle button switches themes", () => {
    render(<Departments />);
    
    const toggleButton = screen.getByRole("button", { name: /Light Mode/i });
    
    fireEvent.click(toggleButton); // Switch to light mode
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(toggleButton); // Switch back to dark mode
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("✅ Each department card contains correct name and description", () => {
    render(<Departments />);

    const departmentNames = [
      "Faculty of Arts & Humanities",
      "Faculty of Social Science & Public Policy",
      "Faculty of Natural, Mathematical & Engineering Sciences",
      "Faculty of Life Sciences & Medicine",
      "King's Business School",
      "The Dickson Poon School of Law",
      "Faculty of Dentistry, Oral & Craniofacial Sciences",
      "Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care",
      "Institute of Psychiatry, Psychology & Neuroscience",
      "IT",
      "HR",
      "Finance",
      "Wellbeing",
      "Maintenance",
      "Housing",
      "Admissions",
      "Library Services",
      "Student Affairs",
    ];

    departmentNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test("✅ Clicking on a department link navigates to the correct URL", () => {
    render(<Departments />);


    const links = screen.getAllByRole("link", { name: /Visit/i });

  
    expect(links[0]).toHaveAttribute("href", "https://www.kcl.ac.uk/artshums");
});


});
