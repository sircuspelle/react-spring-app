import React , { useState, useEffect }from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { fetchPoints, clearPoints } from '../redux/pointsSlice';

const ResultsTable = () => {
    const { points, totalElements, currentPage, pageSize } = useSelector(state => state.points);
    const dispatch = useDispatch();

    const onPage = (event) => {
        // event.page - индекс новой страницы
        // event.rows - количество строк
        dispatch(fetchPoints({
            page: event.page,
            size: event.rows
        }));
    };


    const resultTemplate = (rowData) => {
        return (
            <span style={{
                color: rowData.hit ? 'green' : 'red',
                fontWeight: 'bold'
            }}>
                {rowData.hit ? 'Попал' : 'Промах'}
            </span>
        );
    };

    const first = currentPage * pageSize;

    return (
        <section className="results-section">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3>История</h3>
                <Button
                    label="Очистить"
                    icon="pi pi-trash"
                    className="p-button-danger p-button-text"
                    onClick={() => dispatch(clearPoints())}
                />
            </div>

            <DataTable
                value={points}
                lazy
                paginator

                first = {first}
                rows = {pageSize}
                totalRecords={totalElements}
                onPage={onPage}

                rowsPerPageOptions={[5, 10, 20]}
                showGridlines stripedRows tableStyle={{ minWidth: '100%' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"

                currentPageReportTemplate="Показано с {first} по {last} из {totalRecords}"
                emptyMessage="Результатов пока нет"
            >

                <Column field="x" header="X" style={{ width: '20%' }}></Column>
                <Column field="y" header="Y" style={{ width: '20%' }}></Column>
                <Column field="r" header="R" style={{ width: '20%' }}></Column>
                <Column field="timestamp" header="Время" style={{ width: '25%' }}></Column>
                <Column header="Результат" body={resultTemplate} style={{ width: '15%' }}></Column>
            </DataTable>
        </section>
    );
};

export default ResultsTable;