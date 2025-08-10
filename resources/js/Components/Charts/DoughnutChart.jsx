import React from 'react';
import BaseChart from './BaseChart';

const DoughnutChart = ({ labels = [], datasets = [], options = {}, height = 260, className = '' }) => {
    const data = { labels, datasets };
    const defaultOptions = {
        plugins: { legend: { position: 'right' } },
        cutout: '65%',
    };

    return (
        <BaseChart type="doughnut" data={data} options={{ ...defaultOptions, ...options }} height={height} className={className} />
    );
};

export default DoughnutChart;
