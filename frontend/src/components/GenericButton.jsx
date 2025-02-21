import React from "react";

const GenericButton = ({ children, onClick, className, type = "button", style }) => {
  return (
    <button 
      type={type}
      className={className}
      style={style} 
      onClick={onClick}
      data-testid = "generic-button"
    >
      {children}
    </button>
  );
};

export default GenericButton;
