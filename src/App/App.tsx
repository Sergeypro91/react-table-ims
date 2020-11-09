import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Table } from './Components/Table/Table';
import './App.scss';

interface RowProps {
    id: number;
    original: any;
    index: number;
    depth: number;
    cells: any[];
    values: any;
    originalSubRows: any[];
    subRows: any[];
    getRowProps: any;
    allCells: any[];
}

const App = () => {
    const [tableData, setTableData] = useState();
    const [allRow, setAllRow] = useState<RowProps[]>();
    const [selectedRow, setSelectedRow] = useState<RowProps>();
    const [curentRowIndex, setCurentRowIndex] = useState(0);
    const tableRowArr = useRef<HTMLTableRowElement[]>();

    const getTableData = () => {
        const url = 'https://team.carddex.ru/api/rr/monitoring/base/online?count=100';

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setTableData(data.list);
            })
            .catch((e) => console.log('Error', e));
    };

    useEffect(() => {
        getTableData();
    }, []);

    useEffect(() => {
        tableRowArr.current = Array.from(document.querySelectorAll('.table__row'));
        if (allRow) {
            if (selectedRow === undefined) {
                setSelectedRow(allRow[0]);
            }
        }
    }, [tableData, allRow, selectedRow]);

    useEffect(() => {
        if (allRow) {
            if (allRow[0].index) {
                if (allRow[selectedRow!.index].index !== selectedRow!.index) {
                    const newIndex = allRow.findIndex((element: RowProps, id: number) => {
                        if (element.index === selectedRow!.index) {
                            return id;
                        }
                        return undefined;
                    });

                    setCurentRowIndex(newIndex);
                }
            } else if (selectedRow) {
                setCurentRowIndex(selectedRow!.index);
            }
        }
    }, [allRow, selectedRow]);

    useEffect(() => {
        if (tableRowArr.current) {
            if (tableRowArr.current![curentRowIndex!]) {
                tableRowArr.current![curentRowIndex!].scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }, [curentRowIndex]);

    useEffect(() => {
        if (selectedRow) {
            document.querySelector('.table__row--active')?.classList.remove('table__row--active');

            if (curentRowIndex >= 0) {
                tableRowArr.current![curentRowIndex!].classList.add('table__row--active');
            } else {
                setCurentRowIndex(0);
            }
        }
    }, [selectedRow, curentRowIndex]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent): any => {
            const trackedKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'];
            const eventKey = trackedKeys.includes(e.key);

            if (eventKey && allRow) {
                if (e.key === 'ArrowUp' && curentRowIndex > 0) {
                    e.preventDefault();
                    e.stopPropagation();

                    setSelectedRow(allRow[curentRowIndex! - 1]);
                    setCurentRowIndex(curentRowIndex! - 1);

                    tableRowArr.current![curentRowIndex! - 1].scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                if (e.key === 'ArrowDown' && curentRowIndex < allRow.length - 1) {
                    e.preventDefault();
                    e.stopPropagation();

                    setSelectedRow(allRow[curentRowIndex! + 1]);
                    setCurentRowIndex(curentRowIndex! + 1);

                    tableRowArr.current![curentRowIndex! + 1].scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                if (e.key === 'Enter') {
                    console.log('Enter');
                }
                if (e.key === 'Escape') {
                    console.log('Escape');
                }
            }
        },
        [curentRowIndex, allRow]
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown as EventListener, false);

        return () => {
            document.removeEventListener('keydown', onKeyDown as EventListener, false);
        };
    }, [tableData, onKeyDown]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Событие',
                accessor: 'eventCodeName'
            },
            {
                Header: 'Время события',
                accessor: 'eventDateTime',
                width: 80
            },
            {
                Header: 'Физ. лицо',
                accessor: 'physpersonName'
            },
            {
                Header: 'Источник',
                accessor: 'sourceName'
            }
        ],
        []
    );

    const data = React.useMemo(() => tableData, [tableData]);

    return (
        <div className="app">
            <div
                className="custom-tabl"
                onDoubleClick={() => console.log('Double CLICK')}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Context menu');
                }}>
                {data ? (
                    <Table
                        columns={columns}
                        data={data}
                        setSelectedRow={setSelectedRow}
                        setAllRow={setAllRow}
                        setCurentRowIndex={setCurentRowIndex}
                    />
                ) : (
                    <div>Loading data</div>
                )}
            </div>
        </div>
    );
};

export default App;
