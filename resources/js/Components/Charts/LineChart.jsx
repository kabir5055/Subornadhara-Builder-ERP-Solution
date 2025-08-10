import React from 'react';
import BaseChart from './BaseChart';

const LineChart = ({ labels = [], datasets = [], options = {}, height = 260, className = '' }) => {
    const data = {
        labels,
        datasets: datasets.map(ds => ({
            ...ds,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 2,
        })),
    };

    const defaultOptions = {
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <BaseChart type="line" data={data} options={{ ...defaultOptions, ...options }} height={height} className={className} />
    );
};

export default LineChart;
