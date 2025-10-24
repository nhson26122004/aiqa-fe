import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ScoreStats } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ScoreChartProps {
  data: ScoreStats[]
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => `Score ${d.score}`),
    datasets: [
      {
        label: 'Number of Ratings',
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Conversation Ratings Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  )
}
