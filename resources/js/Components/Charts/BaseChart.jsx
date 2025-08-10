import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BaseChart = ({ type = 'line', data, options, className = '', height = 260 }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // Destroy previous chart instance to avoid leaks on hot reloads
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    tooltip: { mode: 'index', intersect: false },
                },
                interaction: { mode: 'nearest', intersect: false },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
                },
                ...options,
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [type, JSON.stringify(data), JSON.stringify(options)]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={`relative w-full ${className}`} style={{ height }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default BaseChart;
