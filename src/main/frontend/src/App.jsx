import React from 'react';
import {useSelector} from "react-redux";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

// реализация паттерна Protected Route
// компонент-обёртка
const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    // если нет пользователя в store, то направляем на login
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            {/*вездесущая шапка*/}
            <Header />
            {/*рендер нужной страницы*/}
            <div className="container">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/main"
                        element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/main" />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

// The export default keywords specify the main component in the file
export default App;