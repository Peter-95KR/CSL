import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  type: 'pie' | 'doughnut';
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, type = 'pie', options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return type === 'pie' ? (
    <Pie data={data} options={mergedOptions} />
  ) : (
    <Doughnut data={data} options={mergedOptions} />
  );
};

export default PieChart;
