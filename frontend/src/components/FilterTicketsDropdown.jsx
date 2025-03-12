import React, { useState } from 'react';
import GenericDropdown from './GenericDropdown';
import { Filter, FilterX } from 'lucide-react';
import GenericInput from './GenericInput';
import GenericButton from './GenericButton';

const FilterTicketsDropdown = ({
	priority,
	status,
	isOverdue,
	setPriority,
	setStatus,
	setIsOverdue,
	applyFilters,
	clearFilters,
}) => {
	const [isFilterActive, setIsFilterActive] = useState(false);

	return (
		<div className="flex items-center justify-center gap-2">
			{isFilterActive && (
				<GenericButton
					onClick={() => {
						clearFilters();
						setIsFilterActive(false);
					}}
					className="flex items-center justify-items-center gap-2 px-3 h-10 text-white hover:bg-red-400 transition-colors duration-500 bg-red-700 rounded-md"
				>
					<FilterX size={16} />
					Clear
				</GenericButton>
			)}
			<GenericDropdown
				buttonName={<Filter size={16} />}
				maxHeight={'none'}
				className="flex items-center justify-items-center h-10 px-3 w-fit gap-1 text-white font-medium hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
			>
				<div className="space-y-3 p-3">
					<div className="space-y-2">
						<p className="w-full text-center font-medium text-lg">Status</p>
						<ul className="grid grid-cols-2 gap-2 space-x-3 w-full items-center justify-center">
							<li>
								<GenericInput
									label="Open"
									type="radio"
									name="status"
									value="Open"
									checked={status === 'Open'}
									onChange={(e) => setStatus(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
							<li>
								<GenericInput
									label="In Progress"
									type="radio"
									name="status"
									value="In Progress"
									checked={status === 'In Progress'}
									onChange={(e) => setStatus(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm text-right"
									divClassName="flex justify-end gap-2"
								/>
							</li>
							<li>
								<GenericInput
									label="Awaiting Student"
									type="radio"
									name="status"
									value="Awaiting Student"
									checked={status === 'Awaiting Student'}
									onChange={(e) => setStatus(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm text-right"
									divClassName="flex justify-end gap-2 w-100"
								/>
							</li>
							<li>
								<GenericInput
									label="Closed"
									type="radio"
									name="status"
									value="Closed"
									checked={status === 'Closed'}
									onChange={(e) => setStatus(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
						</ul>
					</div>
					<div className="space-y-2">
						<p className="w-full text-center font-medium text-lg">Priority</p>
						<ul className="flex gap-5 w-full items-center justify-center">
							<li>
								<GenericInput
									label="Low"
									type="radio"
									name="priority"
									value="Low"
									checked={priority === 'Low'}
									onChange={(e) => setPriority(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
							<li>
								<GenericInput
									label="Medium"
									type="radio"
									name="priority"
									value="Medium"
									checked={priority === 'Medium'}
									onChange={(e) => setPriority(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
							<li>
								<GenericInput
									label="High"
									type="radio"
									name="priority"
									value="High"
									checked={priority === 'High'}
									onChange={(e) => setPriority(e.target.value)}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
						</ul>
					</div>
					<div className="space-y-2 pb-6">
						<p className="w-full text-center font-medium text-lg">Overdue?</p>
						<ul className="flex gap-5 w-full items-center justify-center">
							<li>
								<GenericInput
									label="Yes"
									type="radio"
									name="isOverdue"
									value={true}
									checked={isOverdue === true}
									onChange={(e) => setIsOverdue(e.target.value === 'true')}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
							<li>
								<GenericInput
									label="No"
									type="radio"
									name="isOverdue"
									value={false}
									checked={isOverdue === false}
									onChange={(e) => setIsOverdue(e.target.value === 'true')}
									className="w-fit cursor-pointer accent-red-500"
									labelClassName="text-gray-700 text-sm"
									divClassName="flex justify-end gap-2"
								/>
							</li>
						</ul>
					</div>
					<div className="flex justify-center gap-2 ">
						<GenericButton
							onClick={() => {
								clearFilters();
								setIsFilterActive(false);
							}}
							className="flex items-center justify-items-center px-3 py-1 text-white hover:bg-red-400 transition-colors duration-500 bg-red-700 rounded-md"
						>
							Clear
						</GenericButton>
						<GenericButton
							onClick={() => {
								applyFilters();
								setIsFilterActive(true);
							}}
							className="flex items-center justify-items-center px-3 py-1 text-white hover:bg-customOrange-light transition-colors duration-500 bg-customOrange-dark rounded-md"
						>
							Apply
						</GenericButton>
					</div>
				</div>
			</GenericDropdown>
		</div>
	);
};

export default FilterTicketsDropdown;
