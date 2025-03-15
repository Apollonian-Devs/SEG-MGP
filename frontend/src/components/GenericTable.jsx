import React, { useState } from 'react';

const GenericTable = ({ tableClass = `min-w-full divide-y divide-gray-200`,bodyClass = "divide-y divide-gray-200",columnDefinition,data=[],dataName='data',rowDefinition}) => {
  // disclaimer: pagination functionality adapted from https://medium.com/@bobjunior542/implementing-pagination-in-reactjs-with-data-fetching-a-step-by-step-guide-84aaa26a473d
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
    return (
      <>
        <div className="flex justify-end mb-4">
          <label className="mr-2 text-gray-700">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-2 border-customOrange-light rounded-md p-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg">
        <table className = {tableClass}>
        <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {columnDefinition}
                </tr>
            </thead>
            <tbody className={bodyClass}>
            {data.length === 0 ? (
                  <tr>
                    <td  colSpan= {columnDefinition.length} className="px-6 py-4 text-center text-gray-500">
                      No {dataName} found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(
                    (row) => rowDefinition(row)
                  )
                )}
                
                
            </tbody>
        </table>
        </div>

        {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-2 border-customOrange-light rounded-md disabled:opacity-50"
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
            className="px-4 py-2 border border-2 border-customOrange-light rounded-md disabled:opacity-50"
          >
            Last
          </button>
        </div>
      )}
      </>
    );
};

export default GenericTable;