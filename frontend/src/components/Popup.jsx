import React from "react";

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-md shadow-lg w-[500px] min-h-[300px]">
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
