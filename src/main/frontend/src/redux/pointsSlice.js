import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

import {logout} from './authSlice'

const getAuthHeader = (getState) => {
    const token = getState().auth.user?.token;
    return {headers: {Authorization: `Basic ${token}`}};
};


export const fetchPoints = createAsyncThunk(
    'points/fetchPoints',
    async (
        {page, size} = {},
        {getState, rejectWithValue}) => {
        try {

            const currentState = getState().points;
            const pageToFetch = page !== undefined ? page : currentState.currentPage;
            const sizeToFetch = size !== undefined ? size : currentState.pageSize;

            const response = await axios.get(
                `/api/results?page=${pageToFetch}&size=${sizeToFetch}`,
                getAuthHeader(getState)
            );
            // Spring HATEOAS возвращает _embedded.resultList
            // если список пуст, _embedded может отсутствовать
            // сейчас вот так стало
            // {
            //   "_embedded": { "resultList": [...] },
            //   "page": { "size": 10, "totalElements": 50, "totalPages": 5, "number": 0 }
            // }
            return {
                points: response.data._embedded ? response.data._embedded.resultList : [],
                totalElements: response.data.page ? response.data.page.totalElements : 0,
                totalPages: response.data.page ? response.data.page.totalPages : 0,
                currentPage: response.data.page ? response.data.page.number : 0,
                pageSize: response.data.page ? response.data.page.size : 10,

            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addPoint = createAsyncThunk(
    'points/addPoint',
    // pointData — это объект {x, y, r} из компонента
    async (pointData, {getState, dispatch, rejectWithValue}) => {
        try {
            const response = await axios.post('/api/results', pointData, getAuthHeader(getState));

            // после добавления надо подгрузить страницу
            dispatch(fetchPoints({ page: 0 }));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearPoints = createAsyncThunk(
    'points/clearPoints',
    async (_, {getState, dispatch, rejectWithValue}) => {
        try {
            await axios.delete('/api/results', getAuthHeader(getState));
            // обновить состояние
            dispatch(fetchPoints({ page: 0 }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        points: [],
        totalElements: 0,
        currentPage: 0,
        pageSize: 10,
        rValue: 1, // r нужно и графику, и форме
        status: 'idle',
        error: null
    },
    reducers: {
        // менять r при сдвиге слайдера
        setRValue: (state, action) => {
            state.rValue = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.points = action.payload.points;
                state.totalElements = action.payload.totalElements;
                state.currentPage = action.payload.currentPage;
                if (action.payload.pageSize) {
                    state.pageSize = action.payload.pageSize;
                }
            })
            // .addCase(addPoint.fulfilled, (state, action) => {
            //     // mutable код в ReduxToolkit
            //     state.points.push(action.payload);
            // })
            .addCase(clearPoints.fulfilled, (state) => {
                state.points = [];
            })
            .addCase(logout, (state) => {
                state.points = [];
                state.totalElements = 0;
                state.currentPage = 0;
                state.pageSize = 10;
                state.rValue = 1;
            });
    }
});

export const {setRValue} = pointsSlice.actions;
export default pointsSlice.reducer;