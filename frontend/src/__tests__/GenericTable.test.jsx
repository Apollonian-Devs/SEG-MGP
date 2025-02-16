import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('row 1 column 1')).toBeTruthy();
    expect(screen.getByText('row 1 column 2')).toBeTruthy();
    expect(screen.getByText('row 2 column 1')).toBeTruthy();
    expect(screen.getByText('row 2 column 2')).toBeTruthy();
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
    expect(screen.getByText('No test data found.')).toBeTruthy();
  }

  )
})
  