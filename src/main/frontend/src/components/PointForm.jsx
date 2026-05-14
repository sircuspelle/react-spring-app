import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setRValue } from '../redux/pointsSlice';
import { InputText } from 'primereact/inputtext';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

const PointForm = () => {
    const dispatch = useDispatch();
    const rValue = useSelector(state => state.points.rValue);

    // локальный стейт для формы
    const [x, setX] = useState("0");
    const [y, setY] = useState(0); // Slider работает с числами
    // R берем из Redux, так как он общий с графиком, но редактируем локально
    const [localR, setLocalR] = useState(rValue);

    const handleSubmit = (e) => {
        // без перезагрузки
        e.preventDefault();

        // валидация на клиенте
        const xNum = parseFloat(x.replace(',', '.'));
        const rNum = parseFloat(localR.toString().replace(',', '.'));

        if (isNaN(xNum) || xNum < -5 || xNum > 5) {
            alert("X должен быть числом от -5 до 5");
            return;
        }
        if (isNaN(rNum) || rNum < -5 || rNum > 5 || rNum <= 0) {
            alert("R должен быть числом от -5 до 5 по варианту и больше 0 по здравому смыслу");
            return;
        }

        dispatch(setRValue(rNum)); // обновляем глобальный R
        // передаём в редьюсер слайса
        dispatch(addPoint({ x: xNum, y: y, r: rNum }));
    };

    return (
        <section className="input-section">
            <h3>Ввод данных</h3>
            <form onSubmit={handleSubmit}>
                {/* x: Text (-5 ... 5) */}
                <div className="form-group">
                    <label>X (-5 ... 5):</label>
                    <InputText
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        keyfilter={/^-?\d*[.,]?\d*$/}
                        className="w-full"
                    />
                </div>

                {/* y: Slider (-3 ... 5) */}
                <div className="form-group">
                    <label>Y: {y}</label>
                    {/* Slider в PrimeReact по умолчанию 0-100 */}
                    <Slider
                        value={y}
                        onChange={(e) => setY(e.value)}
                        min={-3}
                        max={5}
                        step={0.1}
                        className="w-full"
                    />
                </div>

                {/* r: Text (-5 ... 5) */}
                <div className="form-group">
                    <label>R (-5 ... 5):</label>
                    <InputText
                        value={localR}
                        onChange={(e) => {
                            setLocalR(e.target.value);
                            // живая перерисовка
                            const val = parseFloat(e.target.value);
                            if(!isNaN(val) && val > 0) dispatch(setRValue(val));
                        }}
                        keyfilter={/^-?\d*[.,]?\d*$/}
                        className="w-full"
                    />
                </div>

                <Button label="Проверить" icon="pi pi-check" type="submit" />
            </form>
        </section>
    );
};

export default PointForm;