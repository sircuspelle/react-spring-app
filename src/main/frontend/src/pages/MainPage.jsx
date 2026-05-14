import React, { useEffect } from 'react';
// useEffect для side эффектовв
import { useDispatch } from 'react-redux';
import { fetchPoints } from '../redux/pointsSlice';
import PointForm from '../components/PointForm';
import Graph from '../components/Graph';
import ResultsTable from '../components/ResultsTable';

const MainPage = () => {
    const dispatch = useDispatch();

    // после монтирования компонента применится useEffect
    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    return (
        <div className="main-content-wrapper">
            <div className="left-column">
                <PointForm />
                <ResultsTable />
            </div>
            <div className="right-column">
                <Graph />
            </div>
        </div>
    );
};

export default MainPage;