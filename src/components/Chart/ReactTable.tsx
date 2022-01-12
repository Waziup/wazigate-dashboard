import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { Collapse } from '@material-ui/core';


TimeAgo.addDefaultLocale(en)



type TimeSeriesDataType = {
  time: string;
  value: number;
};

type Props = {
  // handleDrawerToggle: () => void;
  title?: string;
  height?: number;
  width?: number;
  className?: string;
  data?: TimeSeriesDataType[];
};


function _ReactTable(props: Props) {

  const timeAgo = new TimeAgo('en-US')

  /**---------------- */

    const dateFormatter = (inDate: Date) => {
      const addZero = (n: number) => (n <= 9 ? ("0" + n) : String(n));
      const dateObj = new Date(inDate);
      return timeAgo.format(inDate)
          + " - " + dateObj.getFullYear()
          + "-" + addZero(dateObj.getMonth() + 1)
          + "-" + addZero(dateObj.getDate())
          + " " + addZero(dateObj.getHours())
          + ":" + addZero(dateObj.getMinutes())
          + ":" + addZero(dateObj.getSeconds())
  }

  /**---------------- */

  // Preparing data
  let tableData = [];
  for (let item of props.data) {
      tableData.push({ x: dateFormatter(new Date(item.time)), y: item.value });
      //console.log(timeAgo.format(new Date(item.time)), new Date(item.time));
  }

  const columns = [
    {
      Header: 'Time',
      accessor: 'x', // accessor is the "key" in the data
    },
    {
      Header: 'Value',
      accessor: 'y',
    },
  ]


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData/*, autoResetSortBy: false, autoResetPage: false */}, useSortBy);

  return (
    <div>
      <table {...getTableProps()} style={{ border: 'solid 1px black', width: '90%', textAlign: 'center' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps((column as any).getSortByToggleProps())}
                  style={{
                    backgroundColor: '#f35e19',
                    color: 'white',
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {(column as any).isSorted
                      ? (column as any).isSortedDesc
                        ? '🔽'
                        : '🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default _ReactTable;