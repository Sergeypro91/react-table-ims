// @ts-nocheck
import React, { memo } from 'react';
import { useTable, useSortBy } from 'react-table';
import './Table.scss';

interface TableProps {
    columns: any[];
    data: any[];
    setSelectRow: (property: any) => void;
    setSelectedRowData: (property: any) => void;
}

const TableInner = ({ columns, data, setSelectRow, setSelectedRowData }: TableProps) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data
        },
        useSortBy
    );

    const onMouseClick = (id) => {
        setSelectRow(id);
        console.log(id);
    };

    const onMouseDoubleClick = (original) => {
        setSelectedRowData(original);
    };

    const onMouseContextMenu = (id, original) => {
        setSelectRow(id);
        setSelectedRowData(original);
    };

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
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            className="table__row"
                            onClick={() => onMouseClick(row.id)}
                            onDoubleClick={() => onMouseDoubleClick(row.original)}
                            onContextMenu={() => onMouseContextMenu(row.id, row.original)}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export const Table = memo(TableInner);
