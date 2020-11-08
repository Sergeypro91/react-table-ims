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

    // console.log('Render');

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
        if (selectedRow) {
            document.querySelector('.table__row--active')?.classList.remove('table__row--active');
            tableRowArr.current![curentRowIndex!].classList.add('table__row--active');
        }
    }, [selectedRow, curentRowIndex]);

    const onKeyDown = useCallback(
        (ev: KeyboardEvent): any => {
            const trackedKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'];
            const evWithKey = trackedKeys.includes(ev.key);

            if (evWithKey) {
                if (ev.key === 'ArrowUp') {
                    console.log('ArrowUp');
                    ev.preventDefault();
                    ev.stopPropagation();
                    setSelectedRow(allRow && allRow[curentRowIndex! - 1]);
                    setCurentRowIndex(curentRowIndex! - 1);
                }
                if (ev.key === 'ArrowDown') {
                    console.log('ArrowDown');
                    ev.preventDefault();
                    ev.stopPropagation();
                    setSelectedRow(allRow && allRow[curentRowIndex! + 1]);
                    setCurentRowIndex(curentRowIndex! + 1);
                }
                if (ev.key === 'Enter') {
                    console.log('Enter');
                }
                if (ev.key === 'Escape') {
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
                Header: 'Age',
                accessor: 'eventCodeName'
            },
            {
                Header: 'Visits',
                accessor: 'eventDateTime'
            },
            {
                Header: 'Status',
                accessor: 'physpersonName'
            },
            {
                Header: 'Profile Progress',
                accessor: 'sourceName'
            }
        ],
        []
    );

    const data = React.useMemo(() => tableData, [tableData]);

    return (
        <div className="app">
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
    );
};

export default App;
