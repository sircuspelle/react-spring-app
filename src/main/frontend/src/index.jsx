import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './redux/store';

// готовые prime компоненты
// Button - просто красивые кнопки в LoginPage и MainPage
// InputText, Password - валидируемое(keyfilter) текстовое поле и поле пароля с глазком
// Slider - выбор Y
// DataTable, Column - вывод истории: paginator, showGridlines, sortable
// Card - обертка формы LoginPage
// Message - ошибки при входе
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Password} from "primereact/password";
import {Card} from "primereact/card";


// Глобальные стили
import './App.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
// wrapping with Provider gives access to the Redux store
root.render(
    <React.StrictMode>
        <Provider store = {store}>
            <App />
        </Provider>
    </React.StrictMode>
);