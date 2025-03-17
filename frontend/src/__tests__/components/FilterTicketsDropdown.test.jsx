import { render, screen, fireEvent } from "@testing-library/react";
import FilterTicketsDropdown from "../../components/FilterTicketsDropdown";
import { vi } from "vitest";

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

    const highPriorityOption = screen.getByLabelText("High");
    fireEvent.click(highPriorityOption);

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

    const closedStatusOption = screen.getByLabelText("Closed");
    fireEvent.click(closedStatusOption);

    expect(mockSetStatus).toHaveBeenCalledWith("Closed");
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

    const overdueYesOption = screen.getByLabelText("Yes");
    fireEvent.click(overdueYesOption);

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

    const clearButtonOutside = screen.getByTestId("clear-button-outside");
    fireEvent.click(clearButtonOutside);

    expect(mockClearFilters).toHaveBeenCalled();
  });
});
