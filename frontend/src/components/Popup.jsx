import React from "react";

const Popup = ({ isOpen, onClose, children, width="500px", height="300px"}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50">
      <div className={`relative bg-white p-8 rounded-md shadow-lg ${width} ${height}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &#10005;
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};


export default Popup;