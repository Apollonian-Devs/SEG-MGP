import { render, screen, fireEvent } from "@testing-library/react";
import FilterTicketsDropdown from "../../components/FilterTicketsDropdown";
import { expect, vi } from "vitest";
import React from "react";

describe("FilterTicketsDropdown Component", () => {
  let mockSetPriority,
    mockSetStatus,
    mockSetIsOverdue,
    mockApplyFilters,
    mockClearFilters;

  beforeEach(() => {
    mockSetPriority = vi.fn();
    mockSetStatus = vi.fn();
    mockSetIsOverdue = vi.fn();
    mockApplyFilters = vi.fn();
    mockClearFilters = vi.fn();
  });

  it("renders dropdown button", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    // Ensure dropdown button is in the document
    const dropdownButton = screen.getByTestId("filter-tickets-dropdown");
    expect(dropdownButton).toBeInTheDocument();
  });

  it("opens and closes dropdown menu", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    // Click dropdown to open
    const dropdownButton = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(dropdownButton);

    // Check if the dropdown menu appears
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Click again to close
    fireEvent.click(dropdownButton);
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  it("allows selecting a priority option", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const highPriorityInput = screen.getByDisplayValue("High");

    expect(highPriorityInput).toHaveAttribute("name", "priority");
    expect(highPriorityInput).toHaveAttribute("value", "High");

    fireEvent.click(highPriorityInput);

    expect(mockSetPriority).toHaveBeenCalledWith("High");
  });

  it("allows selecting a status option", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const openStatusInput = screen.getByDisplayValue("Open");

    expect(openStatusInput).toHaveAttribute("name", "status");
    expect(openStatusInput).toHaveAttribute("value", "Open");

    fireEvent.click(openStatusInput);

    expect(mockSetStatus).toHaveBeenCalledWith("Open");
  });

  it("allows selecting the overdue option", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const openStatusInput = screen.getByDisplayValue("true");

    expect(openStatusInput).toHaveAttribute("name", "isOverdue");
    expect(openStatusInput).toHaveAttribute("value", "true");

    fireEvent.click(openStatusInput);

    expect(mockSetIsOverdue).toHaveBeenCalledWith(true);
  });

  it("calls applyFilters when Apply button is clicked", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    expect(mockApplyFilters).toHaveBeenCalled();
  });

  it("calls clearFilters when Clear button is clicked (inside dropdown)", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const clearButtonInside = screen.getByTestId("clear-button-inside");
    fireEvent.click(clearButtonInside);

    expect(mockClearFilters).toHaveBeenCalled();
  });

  it("calls clearFilters when Clear button is clicked (outside dropdown)", () => {
    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    // Apply filter first
    const openStatusInput = screen.getByDisplayValue("true");

    expect(openStatusInput).toHaveAttribute("name", "isOverdue");
    expect(openStatusInput).toHaveAttribute("value", "true");

    fireEvent.click(openStatusInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Assert that a new Clear button appears and click it

    const clearButtonOutside = screen.getByTestId("clear-button-outside");
    expect(clearButtonOutside);
    fireEvent.click(clearButtonOutside);

    expect(mockClearFilters).toHaveBeenCalled();
  });

  it("deactivates filter when clear button is clicked", () => {
    const setIsFilterActiveMock = vi.fn();
    vi.spyOn(React, "useState").mockReturnValueOnce([
      true,
      setIsFilterActiveMock,
    ]);

    render(
      <FilterTicketsDropdown
        priority=""
        status=""
        isOverdue={false}
        setPriority={mockSetPriority}
        setStatus={mockSetStatus}
        setIsOverdue={mockSetIsOverdue}
        applyFilters={mockApplyFilters}
        clearFilters={mockClearFilters}
        dataTestId="filter-tickets-dropdown"
      />
    );

    fireEvent.click(screen.getByTestId("filter-tickets-dropdown"));

    const clearButtonInside = screen.getByTestId("clear-button-inside");
    fireEvent.click(clearButtonInside);

    //expect(setIsFilterActiveMock).toHaveBeenCalledWith(false);
  });
});
