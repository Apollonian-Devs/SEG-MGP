import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamCard from "../components/TeamCard";

// Ensure animations run synchronously during tests.
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

describe("TeamCard Component", () => {
  const props = {
    name: "Engineering",
    description: "Test Description",
    imageSrc: "/test.jpg",
    url: "https://example.com",
  };

  test("renders the TeamCard component with correct name and description", () => {
    render(<TeamCard {...props} />);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("clicking on TeamCard should show ProfileDetail", async () => {
    render(<TeamCard {...props} />);
    fireEvent.click(screen.getByText("Engineering"));
    expect(await screen.findByText(/Find out more about Engineering/i)).toBeInTheDocument();
  });

  test("Clicking 'Go Back' should return to TeamCard", async () => {
    render(<TeamCard {...props} />);
    userEvent.click(screen.getByText("Engineering"));
    const backButton = await screen.findByText("Go Back");
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
    expect(await screen.findByText("Engineering")).toBeInTheDocument();
  });

  test("mouse move updates transform on inner card", async () => {
    render(<TeamCard {...props} />);
    const innerCard = screen.getByTestId("team-card-inner");
    const container = innerCard.parentElement;

    // Simulate mouse move
    fireEvent.mouseMove(container, { clientX: 300, clientY: 300 });

    // Wait for Framer Motion to apply styles
    await waitFor(() => {
      const styles = getComputedStyle(innerCard);
      expect(styles.transform).not.toBe(""); // Ensure transform is applied
      expect(styles.transform).toContain("rotateX(");
      expect(styles.transform).toContain("rotateY(");
    });
  });

  test("mouse leave resets transform on inner card to default", async () => {
    render(<TeamCard {...props} />);
    const innerCard = screen.getByTestId("team-card-inner");
    const container = innerCard.parentElement;
  
    // Step 1: Get the initial transform before any interaction
    const getRotationValues = (transform) => {
      const match = transform.match(/rotateX\((-?\d+(?:\.\d+)?)deg\) rotateY\((-?\d+(?:\.\d+)?)deg\)/);
      return match ? [parseFloat(match[1]), parseFloat(match[2])] : null;
    };
  
    const initialTransform = getComputedStyle(innerCard).transform;
    const initialRotation = getRotationValues(initialTransform);
  
    // Step 2: Simulate mouse move to trigger a transform change
    fireEvent.mouseMove(container, { clientX: 300, clientY: 300 });
  
    let movedRotation;
    await waitFor(() => {
      const movedTransform = getComputedStyle(innerCard).transform;
      movedRotation = getRotationValues(movedTransform);
      expect(movedRotation).not.toEqual(initialRotation); // Ensure movement happened
    });
  
    // Step 3: Simulate mouse leave
    fireEvent.mouseLeave(container);
  
    // Step 4: Ensure transform resets back to default (within a small tolerance)
    await waitFor(() => {
      const resetTransform = getComputedStyle(innerCard).transform;
      const resetRotation = getRotationValues(resetTransform);
      expect(resetRotation).not.toEqual(movedRotation);
      expect(resetRotation[0]).toBeCloseTo(initialRotation[0], 1); // Allow slight variation
      expect(resetRotation[1]).toBeCloseTo(initialRotation[1], 1);
    });
  });
  
});
