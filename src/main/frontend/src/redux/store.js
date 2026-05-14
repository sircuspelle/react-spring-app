import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice';

// единая точка, связь данных
const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer
    }
});

export default store;