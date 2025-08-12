'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [indicators, setIndicators] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(symbol);
  }, [symbol]);

  const fetchData = async (selectedSymbol) => {
    setLoading(true);
    setError(null);
    try {
      const [stockRes, indicatorsRes, predictionRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks/${selectedSymbol}`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks/${selectedSymbol}/indicators`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks/${selectedSymbol}/predict`)
      ]);
      
      setStockData(stockRes.data);
      setIndicators(indicatorsRes.data);
      setPrediction(predictionRes.data);

    } catch (err) {
      console.error('API fetch error:', err);
      setError('Failed to fetch data. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stockData.map(data => data.date).reverse(),
    datasets: [
      {
        label: `Closing Price`,
        data: stockData.map(data => data.close).reverse(),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: '#fff',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: `${symbol} Historical Price`,
        color: '#fff',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <section className="flex-1 p-6 overflow-auto bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-700 text-gray-50">
          {symbol} Dashboard
        </h2>
        
        {loading && <p className="text-center my-8 text-gray-400">Loading stock data...</p>}
        {error && <p className="text-center my-8 text-red-500">Error: {error}</p>}
        {!loading && !error && stockData.length > 0 && (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                <p className="text-sm font-semibold text-gray-400">52-Week High</p>
                <p className="text-xl font-bold text-green-400 mt-1">
                  ${indicators?.['52_week_high_low']?.high?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                <p className="text-sm font-semibold text-gray-400">52-Week Low</p>
                <p className="text-xl font-bold text-red-400 mt-1">
                  ${indicators?.['52_week_high_low']?.low?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                <p className="text-sm font-semibold text-gray-400">Next Day Price Prediction</p>
                <p className="text-xl font-bold text-blue-400 mt-1">
                  ${prediction?.next_day_price_prediction || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0 relative">
              <Line data={chartData} options={options} />
            </div>
          </>
        )}
        {!loading && !error && stockData.length === 0 && (
          <p className="text-center my-8 text-gray-400">No data available for this stock.</p>
        )}
      </div>
    </section>
  );
};

export default StockChart;