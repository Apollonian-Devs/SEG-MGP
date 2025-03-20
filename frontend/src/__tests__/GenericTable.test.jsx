import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GenericTable from '../components/GenericTable';

describe('GenericTable', () => {
  const columnDefinition = [
  <th> Column 1 </th>,
  <th> Column 2 </th>,
  ];

  const rowDefinition = (row) =>(
    <tr key={row.id}>
      <td>{row.column1}</td>
      <td>{row.column2}</td>
    </tr>

  );

  it('render table with data',()=>{
    const data = [
      {id:1,column1:'row 1 column 1',column2:'row 1 column 2'},
      {id:2,column1:'row 2 column 1',column2:'row 2 column 2'}
    ];
    render( <GenericTable
      columnDefinition = {columnDefinition}
      data = {data}
      rowDefinition = {rowDefinition}
      />
    )
    expect(screen.getByText('row 1 column 1')).toBeInTheDocument();
    expect(screen.getByText('row 1 column 2')).toBeInTheDocument();
    expect(screen.getByText('row 2 column 1')).toBeInTheDocument();
    expect(screen.getByText('row 2 column 2')).toBeInTheDocument();
  }

  );

  it('render table with no data',()=>{
    const data = [];
    render( <GenericTable
      columnDefinition = {columnDefinition}
      data = {data}
      dataName = 'test data'
      rowDefinition = {rowDefinition}
      />
    )
    expect(screen.getByText('No test data found.')).toBeInTheDocument();
  } );

  it('test table pagination',()=>{
    const data = [
    ];
    for (let i = 0; i < 50; i++) {
      data.push(
        {
        id: i, column1: `row ${i} column 1`, column2: `row ${i} column 2`,
        }
      );
  }
  render(
    <GenericTable
      columnDefinition={columnDefinition}
      data={data}
      dataName='test data'
      rowDefinition={rowDefinition}
    />
  );
    expect(screen.getByText('Last')).toBeInTheDocument();
    fireEvent.click((screen.getByText('Last')));
    expect(screen.getByText('row 49 column 1')).toBeInTheDocument();
    expect(screen.queryByText('row 1 column 1')).not.toBeInTheDocument();
    fireEvent.click((screen.getByText('First')));
    fireEvent.click(screen.getAllByRole("button")[3]);
    expect(screen.getByText('row 9 column 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.getByText('row 1 column 1')).toBeInTheDocument();
    expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    expect(screen.queryByText('row 9 column 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText('10')).toBeInTheDocument();
    fireEvent.click((screen.getByText('10')));
    expect(screen.getByText('row 9 column 1')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
    fireEvent.click((screen.getByText('Last')));

   
  }
  

  
  )
  
  it('test changing rows per page leading to less total pages',()=>{
      const data = [
      ];
      for (let i = 0; i < 6; i++) {
        data.push(
          {
          id: i, column1: `row ${i} column 1`, column2: `row ${i} column 2`,
          }
        );
    }
    render(
      <GenericTable
        columnDefinition={columnDefinition}
        data={data}
        dataName='test data'
        rowDefinition={rowDefinition}
      />
    );
    expect(screen.getByText('Last')).toBeInTheDocument();
    fireEvent.click((screen.getByText('Last')));
    expect(screen.getByText('row 5 column 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText('10')).toBeInTheDocument();
    fireEvent.click((screen.getByText('10')));
    expect(screen.getByText('row 0 column 1')).toBeInTheDocument();
  })


  it('test redirecting ticket resulting in less total pages', () => {
    let data = [];
    for (let i = 0; i < 6; i++) { // Initially 6 entries
        data.push(
            {
                id: i, column1: `row ${i} column 1`, column2: `row ${i} column 2`,
            }
        );
    }

    const { rerender } = render(
        <GenericTable
            columnDefinition={columnDefinition}
            data={data}
            dataName='test data'
            rowDefinition={rowDefinition}
        />
    );

    expect(screen.getByText('Last')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Last'));
    expect(screen.getByText('row 5 column 1')).toBeInTheDocument();

    // Now, reduce the data to 5 entries
    data = data.slice(0, 5);

    rerender(
        <GenericTable
            columnDefinition={columnDefinition}
            data={data}
            dataName='test data'
            rowDefinition={rowDefinition}
        />
    );

    // Ensure the last row is now row 4, and row 5 is no longer in the document
    expect(screen.getByText('row 4 column 1')).toBeInTheDocument();
    expect(screen.queryByText('row 5 column 1')).not.toBeInTheDocument();
  }); 
})
  