import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const token = window.btoa(`${username}:${password}`);
            const config = {
                headers: {
                    Authorization: `Basic ${token}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            await axios.get('api/results', config);

            const userData = { username, token };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;

        } catch (error) {
            if (error.response && error.response.status === 401) {
                return rejectWithValue('Неверный логин или пароль');
            }
            return rejectWithValue(error.message || 'Ошибка сети');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            await axios.post('/api/auth/register', { username, password });
            return { username };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка регистрации');
        }
    }
);

// а может нас помнят...?
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    loading: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // асинхронные действия
        builder
            // успешный вход
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            // не успешный вход
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
            })
            // если норм рега
            .addCase(registerUser.fulfilled, (state) => {
                state.error = null;
                // после регистрации пользователь должен войти сам
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});
// подключим синхронные действия для хука dispatch
export const { logout, clearError } = authSlice.actions;
// редьюсер в store
export default authSlice.reducer;