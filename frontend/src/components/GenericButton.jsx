import React from "react";

const GenericButton = ({ children, onClick, className, type = "button", style, dataTestId = "generic-button" }) => {
  return (
    <button 
      type={type}
      className={className}
      style={style} 
      onClick={onClick}
      data-testid = {dataTestId}
    >
      {children}
    </button>
  );
};

export default GenericButton;
