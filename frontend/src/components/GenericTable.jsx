import React, { useState, useEffect } from 'react';
import GenericDropdown from './GenericDropdown';
import GenericButton from './GenericButton';

const GenericTable = ({
	tableClass = `min-w-full divide-y divide-gray-200`,
	bodyClass = 'divide-y divide-gray-200',
	columnDefinition,
	data = [],
	dataName = 'data',
	rowDefinition,
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const totalPages = Math.ceil(data.length / rowsPerPage);

	useEffect(() => {
		if (data.length === 0) {
			setCurrentPage(1);
			return;
		}
		setCurrentPage(currentPage > totalPages ? totalPages : currentPage);
	}, [data.length]);

	const startIndex = (currentPage - 1) * rowsPerPage;
	const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);
	const options = [5, 10, 20, 50];

	const handleRowsPerPageChange = (option) => {
		setRowsPerPage(option);
		const currentTotalPages = Math.ceil(data.length / option);
		setCurrentPage(currentPage > currentTotalPages ? currentTotalPages : currentPage);
	};
	return (
		<>
			<div className="flex justify-between w-full items-center gap-2 mb-2 text-gray-400">
				<div className="flex items-center gap-2">
					<p className=" font-medium">
						Showing:{' '}
						<span className="font-normal">
							{data.length > 0 ? `${startIndex + 1} - ${startIndex + paginatedData.length}` : 0} 
						</span>{' '}
						of <span className="font-normal">{data.length}</span>
					</p>
				</div>
				<div className="flex items-center gap-2">
					<label className="mr-2 font-medium">Rows per page:</label>
					<GenericDropdown
						buttonName={`${rowsPerPage} rows`}
						className="border-2 outline-none border-gray-400 focus:border-customOrange-dark focus:text-customOrange-dark hover:border-customOrange-dark hover:text-customOrange-dark rounded-md transition-colors duration-500 px-2 py-0.5 gap-2"
						maxHeight="200" // Adjust as needed
					>
						<div className="flex flex-col">
							{options.map((option) => (
								<GenericButton
									key={option}
									value={option}
									onClick={() => handleRowsPerPageChange(option)}
									className="w-full text-left hover:bg-gray-300 transition-colors duration-200 px-4 py-2"
								>
									{option}
								</GenericButton>
							))}
						</div>
					</GenericDropdown>
				</div>
			</div>

			<div>
				<table className={tableClass}>
					<thead>
						<tr>{columnDefinition}</tr>
					</thead>
					<tbody className={bodyClass}>
						{data.length === 0 ? (
							<tr>
								<td
									colSpan={columnDefinition.length}
									className="px-6 py-4 text-center text-gray-500"
								>
									No {dataName} found.
								</td>
							</tr>
						) : (
							paginatedData.map((row) => rowDefinition(row))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex justify-center space-x-2 mt-4">
					<button
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
						className="px-4 py-2 border-2 border-customOrange-light rounded-md disabled:opacity-50"
					>
						First
					</button>

					{currentPage > 1 && (
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							className="px-4 py-2 border rounded-md bg-gray-100"
						>
							{currentPage - 1}
						</button>
					)}

					<button className="px-4 py-2 border rounded-md bg-customOrange-dark text-white">
						{currentPage}
					</button>

					{currentPage < totalPages && (
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							className="px-4 py-2 border rounded-md bg-gray-100"
						>
							{currentPage + 1}
						</button>
					)}

					<button
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
						className="px-4 py-2 border-2 border-customOrange-light rounded-md disabled:opacity-50"
					>
						Last
					</button>
				</div>
			)}
		</>
	);
};

export default GenericTable;
