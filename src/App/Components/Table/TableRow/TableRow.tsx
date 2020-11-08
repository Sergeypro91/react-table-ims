import React, { memo } from 'react';

interface TableRowProps {
    row: any;
    index: number;
    setSelectedRow: (property: any) => void;
    setCurentRowIndex: (property: any) => void;
}

const TableRowInner = (props: TableRowProps) => {
    const onMouseClick = (row: any, index: number) => {
        props.setSelectedRow(row);
        props.setCurentRowIndex(index);
    };

    const onMouseContextMenu = (row: any, index: number) => {
        props.setSelectedRow(row);
        props.setCurentRowIndex(index);
    };

    return (
        <tr
            {...props.row.getRowProps()}
            className="table__row"
            id={props.row.index}
            onClick={() => onMouseClick(props.row, props.index)}
            onContextMenu={() => onMouseContextMenu(props.row, props.index)}>
            {props.row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
            })}
        </tr>
    );
};

export const TableRow = memo(TableRowInner);
