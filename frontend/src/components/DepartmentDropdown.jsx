import React, { useState } from "react";
import GenericDropdown from "./GenericDropdown";
import GenericButton from "./GenericButton";

const DepartmentDropdown = ({ departments, selectedDepartment, setSelectedDepartment }) => {

  const handleSelect = (department) => {
    setSelectedDepartment(department);
    console.log("Department selected");
  };

  return (
    <div className="flex items-center gap-2">
      <GenericDropdown
        buttonName={
          <h5 className="text-sm">{selectedDepartment ? selectedDepartment.name : "Select a department"}</h5>
        }
        className="flex justify-center items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      >
        <div className="py-1">
          {departments.map((department) => (
            <GenericButton
              key={department.id}
              onClick={() => handleSelect(department)}
              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
            >
              {department.name}
            </GenericButton>
          ))}
        </div>
      </GenericDropdown>
    </div>
  );
};

export default DepartmentDropdown;