import React from 'react';
import {useSelector} from "react-redux";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Header />
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

export default App;