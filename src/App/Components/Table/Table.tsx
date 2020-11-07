// @ts-nocheck
import React, { useEffect, memo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { TableRow } from './TableRow/TableRow';
import './Table.scss';

interface TableProps {
    columns: any[];
    data: any[];
    setSelectedRow: (property: any) => void;
    setAllRow: (property: any) => void;
    setCurentRowIndex: (property: any) => void;
}

const TableInner = ({ columns, data, setSelectedRow, setAllRow, setCurentRowIndex }: TableProps) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data
        },
        useSortBy
    );

    useEffect(() => {
        setAllRow(rows);
    }, [rows, setAllRow]);

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted && column.isSortedDesc && ' 🔽'}
                                    {column.isSorted && !column.isSortedDesc && ' 🔼'}
                                    {!column.isSorted && ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <React.Fragment key={row.id}>
                            <TableRow
                                row={row}
                                i={i}
                                setSelectedRow={setSelectedRow}
                                setCurentRowIndex={setCurentRowIndex}
                            />
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

export const Table = memo(TableInner);
