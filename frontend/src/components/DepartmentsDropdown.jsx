import React, { useState, useEffect } from 'react';
import {GenericDropdown} from '.';
import {GenericButton} from '.';
import { University } from 'lucide-react';
import handleApiError from "../utils/errorHandler.js";
import { getWithAuth } from '../utils/apiUtils';

/**
 * DepartmentsDropdown - A dropdown component for selecting a department.
 *
 * @component
 *
 * @state
 * - departments (array): Stores the list of available departments.
 * - selectedDept (object | null): Stores the currently selected department.
 * - loading (boolean): Tracks whether departments are being fetched.
 *
 * @methods
 * - fetchDepartments(): Fetches the list of departments from the API.
 * - handleSelect(department): Updates the selected department for the ticket.
 *
 * @returns {JSX.Element}
 */


const DepartmentsDropdown = ({ ticketId, setSelectedDepartments }) => {
	const [departments, setDepartments] = useState([]);
	const [selectedDept, setSelectedDeptState] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await getWithAuth('/api/departments/');
				setDepartments(response.data);
			} catch (error) {
				handleApiError(error, "Error fetching departments");
			} finally {
				setLoading(false);
			}
		};

		fetchDepartments();
	}, []);

	const handleSelect = (department) => {

		setSelectedDepartments((prev) => ({
			...prev,
			[ticketId]: department,
		}))
		setSelectedDeptState(department);
	};

	if (loading) {
		return <p>Loading departments...</p>;
	}

	return (
		<div className="flex items-center gap-2">
			<GenericDropdown
				buttonName={
					<h5 className="text-sm truncate">
						{selectedDept ? selectedDept.name : 'Select a department'}
					</h5>
				}
				className="flex justify-center items-center w-48 gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
			>
				<div className="py-1">
					{departments.map((department) => (
						<GenericButton
							key={department.id}
							onClick={(e) => {
								e.stopPropagation();
								handleSelect(department);
							}}
							className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-300 transition-colors duration-200 border-b border-gray-300"
						>
							<University className="h-5 w-5 text-customOrange-dark mr-2" />
							{department.name}
						</GenericButton>
					))}
				</div>
			</GenericDropdown>
		</div>
	);
};

export default DepartmentsDropdown;
