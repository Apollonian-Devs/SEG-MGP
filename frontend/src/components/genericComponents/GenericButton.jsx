import React, { useState } from "react";
import "./GenericButton.css";

/**
 * @component
 * GenericButton - A customizable button component with a ripple effect on click.
 *
 * @props
 * - children (ReactNode): The content of the button, typically text or icons.
 * - onClick (function): The function to be called when the button is clicked.
 * - className (string): Custom CSS class for the button's styling.
 * - type (string): The type of the button (default is "button").
 * - style (object): Custom inline styles for the button.
 * - dataTestId (string): A test ID for use in automated testing (default is "generic-button").
 *
 * @state
 * - ripples (array): Tracks the state of each ripple effect, including position and size.
 *
 * @methods
 * - createRipple(event): Creates a ripple effect based on the button's position and the click event.
 *
 * @returns {JSX.Element}
 */

const GenericButton = ({ 
  children, 
  onClick, 
  className, 
  type = "button", 
  style, 
  dataTestId = "generic-button" 
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y, size };
    
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <button 
      type={type}
      className={`relative overflow-hidden ${className}`} 
      style={style} 
      onClick={(e) => {
        createRipple(e);
        if (onClick) onClick(e);
      }}
      data-testid={dataTestId}
    >
      {children}
      {ripples.map(({ id, x, y, size }) => (
        <span 
          key={id} 
          className="ripple" 
          style={{ left: x, top: y, width: size, height: size }}
        />
      ))}
    </button>
  );
};

export default GenericButton;

