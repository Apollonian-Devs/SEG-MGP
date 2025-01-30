import React from "react";

const TicketsCard = () => {
  return (
    <div className='flex flex-col bg-white rounded-3xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]'>
      <div className='-m-1.5 overflow-x-auto'>
        <div className='p-10 min-w-full inline-block align-middle'>
          <h1 className='felx w- full text-center mb-5'>Tickets</h1>
          <div className='overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
                  >
                    Subject
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
                  >
                    Category
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                <tr className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                    John Brown
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>45</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                    New York No. 1 Lake Park
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                    <button
                      type='button'
                      className='inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none'
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                    Jim Green
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>27</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                    London No. 1 Lake Park
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                    <button
                      type='button'
                      className='inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none'
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                    Joe Black
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>31</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                    Sidney No. 1 Lake Park
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                    <button
                      type='button'
                      className='inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none'
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                    Edward King
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>16</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                    LA No. 1 Lake Park
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                    <button
                      type='button'
                      className='inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none'
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                    Jim Red
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>45</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                    Melbourne No. 1 Lake Park
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-end text-sm font-medium'>
                    <button
                      type='button'
                      className='inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsCard;
