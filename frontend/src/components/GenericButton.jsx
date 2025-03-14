import React, { useState } from "react";
import "./GenericButton.css";

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
