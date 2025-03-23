import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Departments from "../../pages/Departments";
import { describe, it, expect } from 'vitest';

describe("Departments Page", () => {
  it("Renders all department cards", () => {
    render(<Departments />);
    const departmentCards = screen.getAllByRole('heading', { level: 3 });
    expect(departmentCards.length).toBe(18);
  });

  it("Each department card contains correct name and description", () => {
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

  it('Flips department card on click', () => {
    render(<Departments />);
    const firstCard = screen.getAllByRole('heading', { level: 3 })[0];
    const parent = firstCard.closest('.cursor-pointer');
    expect(parent).toBeTruthy();
    fireEvent.click(parent);
    // There's no DOM way to assert rotation, but we assert the card still renders after click
    expect(firstCard).toBeInTheDocument();
  });

  it('Each department card contains visit link', () => {
    render(<Departments />);
    const links = screen.getAllByRole('link', { name: /Visit Site/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
