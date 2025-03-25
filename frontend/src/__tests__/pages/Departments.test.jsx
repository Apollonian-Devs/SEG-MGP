import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Departments from "../../pages/Departments";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../../api";

vi.mock("../../api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockDepartments = [
  {
    id: 1,
    name: "Faculty of Arts & Humanities",
    description: "Covers literature, history, philosophy, and creative industries.",
  },
  {
    id: 2,
    name: "Faculty of Social Science & Public Policy",
    description: "Focuses on global affairs, politics, and public policy.",
  },
  {
    id: 3,
    name: "Faculty of Natural, Mathematical & Engineering Sciences",
    description: "Includes mathematics, physics, informatics, and engineering.",
  },
  {
    id: 4,
    name: "Faculty of Life Sciences & Medicine",
    description: "Covers medical biosciences, cardiovascular studies, and pharmaceutical sciences.",
  },
  {
    id: 5,
    name: "King's Business School",
    description: "Focuses on accounting, finance, marketing, and business strategy.",
  },
  {
    id: 6,
    name: "The Dickson Poon School of Law",
    description: "Specializes in legal studies and research.",
  },
  {
    id: 7,
    name: "Faculty of Dentistry, Oral & Craniofacial Sciences",
    description: "Covers dental sciences and oral healthcare.",
  },
  {
    id: 8,
    name: "Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care",
    description: "Focuses on nursing, midwifery, and palliative care.",
  },
  {
    id: 9,
    name: "Institute of Psychiatry, Psychology & Neuroscience",
    description: "Researches mental health, neuroscience, and addiction studies.",
  },
  {
    id: 10,
    name: "IT",
    description: "Handles technical support, student portals, and system security.",
  },
  {
    id: 11,
    name: "HR",
    description: "Manages staff recruitment, payroll, and work policies.",
  },
  {
    id: 12,
    name: "Finance",
    description: "Handles tuition fees, scholarships, and financial aid.",
  },
  {
    id: 13,
    name: "Wellbeing",
    description: "Provides student counseling and wellbeing services.",
  },
  {
    id: 14,
    name: "Maintenance",
    description: "Manages building maintenance, plumbing, and electrical repairs.",
  },
  {
    id: 15,
    name: "Housing",
    description: "Oversees student accommodations, dorm assignments, and rent payments.",
  },
  {
    id: 16,
    name: "Admissions",
    description: "Manages student applications, enrollment, and transfers.",
  },
  {
    id: 17,
    name: "Library Services",
    description: "Oversees book loans, research databases, and study spaces.",
  },
  {
    id: 18,
    name: "Student Affairs",
    description: "Handles extracurricular activities, student unions, and student complaints.",
  },
  {
    id: 19,
    name: "MadeUp Dept",
    description: "This one isn't in the departmentUrls map",
  },
];

describe("Departments Page", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockDepartments });
  });

  it("Renders all department cards", async () => {
    render(<Departments />);
    const departmentCards = await screen.findAllByRole("heading", { level: 3 });
    expect(departmentCards.length).toBe(mockDepartments.length);
  });

  it("Each department card contains correct name", async () => {
    render(<Departments />);
    for (const dept of mockDepartments) {
      expect(await screen.findByText(dept.name)).toBeInTheDocument();
    }
  });

  it("Flips department card on click", async () => {
    render(<Departments />);
    const firstCard = await screen.findAllByRole("heading", { level: 3 }).then(cards => cards[0]);
    const parent = firstCard.closest(".cursor-pointer");
    expect(parent).toBeTruthy();
    fireEvent.click(parent);
    expect(firstCard).toBeInTheDocument();
  });

  it("Each department card contains visit link", async () => {
    render(<Departments />);
    const links = await screen.findAllByRole("link", { name: /Visit Site/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("Shows toast error when department fetch fails", async () => {
    const { toast } = await import("sonner");
    api.get.mockRejectedValue(new Error("Network error"));

    render(<Departments />);

    await screen.findByText(/Explore King's College Departments/i);

    expect(toast.error).toHaveBeenCalledWith("❌ Error fetching departments");
  });

  it("Falls back to '#' when department URL is not found", async () => {
    render(<Departments />);
    const links = await screen.findAllByRole("link", { name: /Visit Site/i });
    const fallbackLink = links.find(link => link.getAttribute("href") === "#");
    expect(fallbackLink).toBeTruthy();
  });
});
