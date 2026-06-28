import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './redux/store';


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Password} from "primereact/password";
import {Card} from "primereact/card";


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