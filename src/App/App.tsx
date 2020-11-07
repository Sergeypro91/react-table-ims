import React, { useState, useEffect } from 'react';
import { Table } from './Components/Table/Table';
import './App.scss';

const App = () => {
    const [tableData, setTableData] = useState([]);
    const [, setSelectRow] = useState<number | null>(null);
    const [, satSelectedRowData] = useState(null);

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
            <Table columns={columns} data={data} setSelectRow={setSelectRow} setSelectedRowData={satSelectedRowData} />
        </div>
    );
};

export default App;
