'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StockChart from '../components/StockChart';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-inter">
      <header className="flex justify-between items-center p-4 shadow-lg bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-gray-50">Stock Dashboard</h1>
      </header>
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar onSelectSymbol={setSelectedSymbol} selectedSymbol={selectedSymbol} />
        <StockChart symbol={selectedSymbol} />
      </main>
    </div>
  );
}