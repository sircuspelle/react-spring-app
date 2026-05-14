import React from 'react';
// Hooks для связи с redux
import { useDispatch, useSelector } from 'react-redux';
// импорт Action из слайса авторизации
import { logout } from '../redux/authSlice';
// Hook для смены URL
import { useNavigate } from 'react-router-dom';
// красивая кнопочка
import { Button } from 'primereact/button';

/**
 * функциональный компонент, возвращающий разметку
 * @returns {React.JSX.Element}
 * @constructor
 */
const Header = () => {
    // обработка actions
    const dispatch = useDispatch();
    // смена url
    const navigate = useNavigate();
    // подписка на полк user из state
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        // примени action
        dispatch(logout());
        // смени страницу
        navigate('/login');
    };

    return (
        <header className="header">
            <div id="info">
                Соловьёв Алексей Владиславович <br/>
                P3230 <br/>
            </div>
            <div style={{ textAlign: 'center' }}>
                Лабораторная работа №4<br/>Вариант: 345
            </div>
            <div>
                {/*условный рендеринг*/}
                {user && (
                    <Button
                        label="Выход"
                        icon="pi pi-sign-out"
                        className="p-button-danger p-button-sm"
                        onClick={handleLogout}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;