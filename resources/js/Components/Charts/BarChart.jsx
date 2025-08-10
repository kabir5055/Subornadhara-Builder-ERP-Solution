import React from 'react';
import BaseChart from './BaseChart';

const BarChart = ({ labels = [], datasets = [], options = {}, stacked = false, height = 260, className = '' }) => {
    const data = {
        labels,
        datasets: datasets.map(ds => ({
            ...ds,
            borderWidth: 1,
        })),
    };

    const defaultOptions = {
        scales: {
            x: { stacked },
            y: { stacked, beginAtZero: true },
        },
    };

    return (
        <BaseChart type="bar" data={data} options={{ ...defaultOptions, ...options }} height={height} className={className} />
    );
};

export default BarChart;
