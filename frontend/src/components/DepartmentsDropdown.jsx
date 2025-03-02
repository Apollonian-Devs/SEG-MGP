import React, { useState, useEffect } from "react";
import GenericDropdown from "./GenericDropdown";
import GenericButton from "./GenericButton";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const DepartmentsDropdown = ({ setSelectedDepartment }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDeptState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("/api/departments/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedDeptState(department);
  };

  if (loading) {
    return <p>Loading departments...</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <GenericDropdown
        buttonName={
          <h5 className="text-sm">{selectedDept ? selectedDept.name : "Select a department"}</h5>
        }
        className="flex justify-center items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      >
        <div className="py-1">
          {departments.map((department) => (
            <GenericButton
              key={department.id}
              onClick={(e) => { 
                e.stopPropagation();
                handleSelect(department);
              }}
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

export default DepartmentsDropdown;