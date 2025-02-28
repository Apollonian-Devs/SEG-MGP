import React, { useState } from "react";
import GenericDropdown from "./GenericDropdown";
import GenericButton from "./GenericButton";

const OfficersDropdown = ({ officers, setSelectedOfficer }) => {
  console.log("Officers in Dropdown", officers)
  const [selectedOfficer, setSelectedOfficerState] = useState(null);

  const handleSelect = (officer) => {
    setSelectedOfficer(officer);
    setSelectedOfficerState(officer);
  };

  return (
    <div className="flex items-center gap-2">
      <GenericDropdown
        buttonName={
          <h5 className="text-sm">{selectedOfficer ? selectedOfficer.user.username : "Select an officer"}</h5>
        }
        className="flex justify-center items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      >
        <div className="py-1">
          {officers.map((officer) => (
            <GenericButton
              key={officer.user.id}
              onClick={(e) => { 
                e.stopPropagation();
                handleSelect(officer);
              }}
              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
            >
              {officer.user.username}
            </GenericButton>
          ))}
        </div>
      </GenericDropdown>
    </div>
  );
};

export default OfficersDropdown;