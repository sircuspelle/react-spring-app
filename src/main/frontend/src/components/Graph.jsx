import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPoint } from '../redux/pointsSlice';

const Graph = () => {
    // доступ к дом в реакте
    const canvasRef = useRef(null);

    const dispatch = useDispatch();
    const { points, rValue } = useSelector(state => state.points);

    const WIDTH = 400;
    const HEIGHT = 400;
    const R_PIXELS = WIDTH / 3;

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'rgba(54, 162, 235, 0.5)';

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, R_PIXELS / 2, -0.5 * Math.PI, 0);
        ctx.closePath();
        ctx.fill();


        ctx.fillRect(centerX, centerY, -R_PIXELS, -R_PIXELS);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - R_PIXELS, centerY);
        ctx.lineTo(centerX, centerY + R_PIXELS);
        ctx.closePath();
        ctx.fill();

        // оси
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY); ctx.lineTo(WIDTH, centerY);
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, HEIGHT);
        ctx.stroke();

        // точки
        points.forEach(point => {
            const canvasX = centerX + (point.x / rValue) * R_PIXELS;
            const canvasY = centerY - (point.y / rValue) * R_PIXELS;

            ctx.fillStyle = point.hit ? 'green' : 'red';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    useEffect(() => {
        draw();
    }, [points, rValue]); // перерисовывать при изменении точек или R

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const scaledClickX = clickX * scaleX;
        const scaledClickY = clickY * scaleY;

        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;

        const mathX = (scaledClickX - centerX) / R_PIXELS * rValue;
        const mathY = (centerY - scaledClickY) / R_PIXELS * rValue;

        if (rValue <= 0) {
            alert("R должен быть положительным!");
            return;
        }

        dispatch(addPoint({ x: mathX.toFixed(4), y: mathY.toFixed(4), r: rValue }));
    };

    return (
        <div className="graph-container">
            <h3>График</h3>
            <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                onClick={handleClick}
                style={{ cursor: 'pointer', maxWidth: '100%' }}
            />
        </div>
    );
};

export default Graph;