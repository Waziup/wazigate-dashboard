import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';

import { Collapse } from '@material-ui/core';
import {
  makeStyles,
  colors,
} from '@material-ui/core';
import { ValueWithTime } from 'waziup';
import { dateFormatter, timeAgo } from '../../tools';




const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    align: 'center',
    margin: '0 auto',
    maxWidth: '1000px'
  },
  table:{
    border: 'solid 1px black', 
    width: '100%',
    align: 'center', 
    textAlign: 'center',
    maxWidth: '1000px'
  },

}));

const columns = [
  {
    Header: 'Time',
    accessor: 'x', // accessor is the "key" in the data
  },
  {
    Header: 'Value',
    accessor: 'y',
  },
];

type TimeSeriesDataType = ValueWithTime;

type Props = {
  // handleDrawerToggle: () => void;
  title?: string;
  height?: number;
  width?: number;
  className?: string;
  data?: DataPoint[];
};

type DataPoint = {
  x: Date;
  y: number;
};

function ReactTable(props: Props) {


  const classes = useStyles();

  /**---------------- */

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { 
      columns, 
      data: props.data,
      initialState: {
        sortBy: [
            {
                id: 'Time',
                desc: true
            }
        ]
    } 
      /*, autoResetSortBy: false, autoResetPage: false */ 
    }, 
    useSortBy
    );


  return (
    <div className={classes.root}>
      <table className={classes.table}{...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    backgroundColor: '#f35e19',
                    color: 'white',
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
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
                      {valueFormat(cell.value)}
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

function valueFormat(val: unknown): string {
  if(val instanceof Date) return dateFormatter(val);
  return `${val}`;
}

export default ReactTable;