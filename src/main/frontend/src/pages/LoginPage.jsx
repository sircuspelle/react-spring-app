import React, {useState, useEffect} from 'react';
// стандартные хуки
import {useDispatch, useSelector} from 'react-redux';
// actions из slice
import {loginUser, registerUser, clearError} from '../redux/authSlice';
// навигация
import {useNavigate} from 'react-router-dom';
// красивые primerecat компоненты
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import {Message} from 'primereact/message';

const LoginPage = () => {
    // переменные для хранения ввода, текст жестко связан с переменной
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [localError, setLocalError] = useState(null);

    // хуки подключаем
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // подключаемся к store
    const {user, error} = useSelector(state => state.auth);

    // хук: функция и массив зависимостей
    useEffect(() => {
        if (user) {
            navigate('/main');
        }
    }, [user, navigate]);

    // функция проверки полей
    const validateInputs = () => {
        if (!username.trim()) {
            setLocalError('Логин не может быть пустым');
            return false;
        }
        if (!password.trim()) {
            setLocalError('Пароль не может быть пустым');
            return false;
        }
        setLocalError(null); // очищаем ошибку, если всё ок
        return true;
    };

    const handleLogin = () => {
        // валидируем
        if (!validateInputs()) return;

        // применяем хук для вызова action
        dispatch(loginUser({username, password}));
    };

    // функция регистрации
    const handleRegister = () => {
        if (!validateInputs()) return;

        // хук на действие
        dispatch(registerUser({username, password}))
            // развернуть промис
            .unwrap()
            .then(() => {
                alert("Регистрация успешна! Теперь войдите.");
                setLocalError(null);

                // очистить поля - переменные
                setUsername('');
                setPassword('');
            })
            .catch(() => {
                // redux сам пишет ошибку в state.error
            });
    };

    // объединить ошибки
    const displayError = localError || error;

    return (
        <div className="login-container"
             style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
            <Card title="Вход в систему" style={{width: '25rem'}}>
                {/*растягиваем поля*/}
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="username">Логин</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setLocalError(null); // Сбрасываем ошибку при вводе
                            }}
                        />
                    </div>
                    <div className="field" style={{marginTop: '1rem'}}>
                        <label htmlFor="password">Пароль</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLocalError(null);
                            }}
                            feedback={true}
                            // глазок
                            toggleMask
                        />
                    </div>

                    {displayError && (
                        <Message
                            // severity="error": Красит сообщение в красный цвет и добавляет иконку крестика/восклицательного знака.
                            severity="error"
                            text={typeof displayError === 'string' ? displayError : "Ошибка"}
                            style={{marginTop: '1rem', width: '100%'}}
                        />
                    )}

                    <div style={{display: 'flex', gap: '10px', marginTop: '2rem'}}>
                        <Button label="Войти" icon="pi pi-user" onClick={handleLogin}/>
                        <Button label="Регистрация" icon="pi pi-user-plus" className="p-button-secondary"
                                onClick={handleRegister}/>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;