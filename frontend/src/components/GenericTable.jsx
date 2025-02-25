import React from "react";

const GenericTable = ({ tableClass = `min-w-full divide-y divide-gray-200`,bodyClass = "divide-y divide-gray-200",columnDefinition,data,dataName='data',rowDefinition}) => {
    return (
        <table className = {tableClass}>
            <thead>
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
                    data.map(
                        (row) => rowDefinition(row)
                      )
                )}
                
                
            </tbody>
        </table>
    );
};

export default GenericTable;