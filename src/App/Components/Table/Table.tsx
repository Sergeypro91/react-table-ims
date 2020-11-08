// @ts-nocheck
import React, { useEffect, memo } from 'react';
import { useTable, useSortBy, useFlexLayout, useResizeColumns } from 'react-table';
// import { TableRow } from './TableRow/TableRow';
import './Table.scss';

interface TableProps {
    columns: any[];
    data: any[];
    setSelectedRow: (property: any) => void;
    setAllRow: (property: any) => void;
    setCurentRowIndex: (property: any) => void;
}

const getStyles = (props, align = 'left') => [
    props,
    {
        style: {
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            display: 'flex'
        }
    }
];

const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const TableInner = ({ columns, data, setSelectedRow, setAllRow, setCurentRowIndex }: TableProps) => {
    const defaultColumn = React.useMemo(
        () => ({
            // When using the useFlexLayout:
            minWidth: 30, // minWidth is only used as a limit for resizing
            width: 150, // width is used for both the flex-basis and flex-grow
            maxWidth: 200 // maxWidth is only used as a limit for resizing
        }),
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useSortBy,
        useFlexLayout,
        useResizeColumns
    );

    const onMouseClick = (row: any, index: number) => {
        setSelectedRow(row);
        setCurentRowIndex(index);
    };

    const onMouseContextMenu = (row: any, index: number) => {
        setSelectedRow(row);
        setCurentRowIndex(index);
    };

    useEffect(() => {
        setAllRow(rows);
    }, [rows, setAllRow]);

    return (
        <div {...getTableProps()} className="table">
            <div className="table__head">
                {headerGroups.map((headerGroup) => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map((column) => (
                            <div {...column.getHeaderProps(column.getSortByToggleProps(headerProps))} className="th">
                                {column.render('Header')}
                                {/* Use column.getResizerProps to hook up the events correctly */}
                                {column.canResize && (
                                    <div
                                        {...column.getResizerProps()}
                                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                    />
                                )}
                                <span>
                                    {column.isSorted && column.isSortedDesc && ' 🔽'}
                                    {column.isSorted && !column.isSortedDesc && ' 🔼'}
                                    {!column.isSorted && ''}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div {...getTableBodyProps()} className="tbody table__body">
                {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                        <div
                            {...row.getRowProps()}
                            className="table__row"
                            id={index}
                            onClick={() => onMouseClick(row, index)}
                            onContextMenu={() => onMouseContextMenu(row, index)}>
                            {row.cells.map((cell: any) => {
                                return (
                                    <div className="td" {...cell.getCellProps(cellProps)}>
                                        {cell.render('Cell')}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const Table = memo(TableInner);
